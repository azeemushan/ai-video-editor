const { faker } = require('@faker-js/faker');
const { PrismaClient } = require('@prisma/client');
const client = new PrismaClient();
const { hash } = require('bcryptjs');
const { randomUUID } = require('crypto');
const { addMonths } = require('date-fns');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);


const ADMIN_EMAIL = 'admin@gmail.com';
const ADMIN_PASSWORD = '123456789';
const ADMIN_NAME = 'admin';

async function seedUsers() {
  const newUsers: any[] = [];
  await createAdminUser();

  console.log('Seeded users', newUsers.length);

  return newUsers;

  async function createAdminUser() {
    const email = ADMIN_EMAIL;
    try {
      const originalPassword = ADMIN_PASSWORD;
      const password = await hash(originalPassword, 12);
      const user = await client.user.create({
        data: {
          email,
          name: ADMIN_NAME,
          password,
          emailVerified: new Date(),
          user_type: 'ADMIN',
        },
      });
      newUsers.push({
        ...user,
        password: originalPassword,
      });
    } catch (ex: any) {
      if (ex.message.indexOf('Unique constraint failed') > -1) {
        console.error('Duplicate email', email);
      } else {
        console.log(ex);
      }
    }
  }
}

async function seedTeams() {
  const newTeams: any[] = [];

  await Promise.all(
    Array(5)
      .fill(0)
      .map(() => createRandomTeam())
  );
  console.log('Seeded teams', newTeams.length);
  return newTeams;

  async function createRandomTeam() {
    const name = faker.company.name();
    const team = await client.team.create({
      data: {
        name,
        slug: name
          .toString()
          .toLowerCase()
          .replace(/\s+/g, '-')
          .replace(/[^\w-]+/g, '')
          .replace(/--+/g, '-')
          .replace(/^-+/, '')
          .replace(/-+$/, ''),
      },
    });
    newTeams.push(team);
  }
}

async function seedTeamMembers(users: any[], teams: any[]) {
  const newTeamMembers: any[] = [];
  const roles = ['OWNER', 'MEMBER'];
  for (const user of users) {
    const count = Math.floor(Math.random() * 4) + 2;
    const teamUsed = new Set();
    for (let j = 0; j < count; j++) {
      try {
        let teamId;
        do {
          teamId = teams[Math.floor(Math.random() * teams.length)].id;
        } while (teamUsed.has(teamId));
        teamUsed.add(teamId);
        newTeamMembers.push({
          role: user.email === ADMIN_EMAIL ? 'OWNER' : roles[Math.floor(Math.random() * roles.length)],
          teamId,
          userId: user.id,
        });
      } catch (ex) {
        console.log(ex);
      }
    }
  }

  await client.teamMember.createMany({
    data: newTeamMembers,
  });
  console.log('Seeded team members', newTeamMembers.length);
}

async function seedInvitations(teams: any[], users: any[]) {
  const newInvitations: any[] = [];
  for (const team of teams) {
    const count = Math.floor(Math.random() * users.length) + 2;
    for (let j = 0; j < count; j++) {
      try {
        const invitation = await client.invitation.create({
          data: {
            teamId: team.id,
            invitedBy: users[Math.floor(Math.random() * users.length)].id,
            email: faker.internet.email(),
            role: 'MEMBER',
            sentViaEmail: true,
            token: randomUUID(),
            allowedDomains: [],
            expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          },
        });
        newInvitations.push(invitation);
      } catch (ex) {
        console.log(ex);
      }
    }
  }

  console.log('Seeded invitations', newInvitations.length);

  return newInvitations;
}



async function seedSubscriptionPackages() {
  const packages = [
    {
      price: 29,
      upload_video_limit: 10,
      generate_clips: 100,
      max_length_video: '00:45:00',
      total_min: 29 * 15,
      subscription_type: 'BASIC',
      sub_dur_type: 'MONTHLY'
    },
    {
      price: 79,
      upload_video_limit: 30,
      generate_clips: 300,
      max_length_video: '02:00:00',
      total_min: 79 * 15,
      subscription_type: 'PRO',
      sub_dur_type: 'MONTHLY'
    },
    {
      price: 189,
      upload_video_limit: 100,
      generate_clips: 1000,
      max_length_video: '03:00:00',
      total_min: 189 * 15,
      subscription_type: 'PREMIUM',
      sub_dur_type: 'MONTHLY'
    },
    {
      price: 23,
      upload_video_limit: 10,
      generate_clips: 100,
      max_length_video: '00:45:00',
      total_min: 23 * 15,
      subscription_type: 'BASIC',
      sub_dur_type: 'YEARLY'
    },
    {
      price: 63,
      upload_video_limit: 30,
      generate_clips: 300,
      max_length_video: '02:00:00',
      total_min: 63 * 15,
      subscription_type: 'PRO',
      sub_dur_type: 'YEARLY'
    },
    {
      price: 151,
      upload_video_limit: 100,
      generate_clips: 1000,
      max_length_video: '03:00:00',
      total_min: 151 * 15,
      subscription_type: 'PREMIUM',
      sub_dur_type: 'YEARLY'
    },
  ];

  for (const pkg of packages) {
    const existingPackage = await client.subscriptionPackage.findFirst({
      where: {
        subscription_type: pkg.subscription_type,
        sub_dur_type: pkg.sub_dur_type
      },
    });

    let packageId;
    if (!existingPackage) {
      const newPackage = await client.subscriptionPackage.create({
        data: pkg,
      });
      console.log('Seeded subscription package', newPackage);
      packageId = newPackage.id;
    } else {
      console.log('Subscription package already exists', existingPackage);
      packageId = existingPackage.id;
    }

    // Check if the product already exists
    const existingProducts = await stripe.products.list({
      limit: 100,
      active: true,
    });

    let product = existingProducts.data.find(p => p.name === pkg.subscription_type);

    if (!product) {
      product = await stripe.products.create({
        name: pkg.subscription_type,
      });
    }

    // Check if the price already exists
    const existingPrices = await stripe.prices.list({
      product: product.id,
      active: true,
    });

    // Check if the product already has two prices
    if (existingPrices.data.length >= 2) {
      console.log(`Product ${product.name} already has two prices. Skipping price creation.`);
      continue;
    }

    let priceAmount = pkg.price * 100; // Stripe expects the amount in cents
    if (pkg.sub_dur_type.toLowerCase() === 'yearly') {
      priceAmount *= 12; // Multiply by 12 for yearly subscription
    }

    let stripePrice = existingPrices.data.find(p => p.unit_amount === priceAmount && p.recurring.interval === pkg.sub_dur_type.toLowerCase());

    if (!stripePrice) {
      stripePrice = await stripe.prices.create({
        unit_amount: priceAmount,
        currency: 'usd',
        recurring: {
          interval: pkg.sub_dur_type.toLowerCase() === 'monthly' ? 'month' : 'year', // 'month' or 'year'
        },
        product: product.id,
      });
    }

    const paymentLink = await stripe.paymentLinks.create({
      line_items: [{ price: stripePrice.id, quantity: 1 }],
    });

    await client.subscriptionPackage.update({
      where: {
        id: packageId,
      },
      data: {
        stripe_payment_link: paymentLink.url,
        stripe_priceId: stripePrice.id, // Add the stripe_priceId here
      },
    });
    console.log('Stripe payment link and price ID created and updated', pkg);
  }
}









async function seedSingleSubscription() {
  const firstUser = await client.user.findFirst();
  const firstPackage = await client.subscriptionPackage.findFirst();

  if (firstUser && firstPackage) {
    const existingSubscription = await client.subscriptions.findFirst({
      where: {
        user_id: firstUser.id,
        subscription_pkg_id: firstPackage.id,
      },
    });

    if (!existingSubscription) {
      const startDate = new Date();
      const endDate = addMonths(startDate, 1);

      await client.subscriptions.create({
        data: {
          subscription_pkg_id: firstPackage.id,
          user_id: firstUser.id,
          start_date: startDate,
          end_date: endDate,
          status: true,
        },
      });

      console.log(`Seeded subscription for user ${firstUser.email} with package ${firstPackage.subscription_type}`);
    } else {
      console.log(`Subscription already exists for user ${firstUser.email} with package ${firstPackage.subscription_type}`);
    }
  }
}

async function init() {
  await seedUsers();
  // const users = await client.user.findMany();
  // const teams = await seedTeams();
  // await seedTeamMembers(users, teams);
  // await seedInvitations(teams, users);
  await seedSubscriptionPackages();
  // await seedSingleSubscription();
}
init();
