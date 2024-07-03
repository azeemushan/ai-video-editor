import { prisma } from '@/lib/prisma';
export const getSubscriptionPackage = async () => {
  try {
    const subscriptionPackages = await prisma.subscriptionPackage.findMany();
    return subscriptionPackages;
  } catch (error) {
    console.error('Error fetching subscription Packages:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
};


export const getUpSubscriptionPackage = async (stripe_priceId:string) => {
  try {
    // First, find the creation timestamp of the given stripe_priceId
    const currentPackage = await prisma.subscriptionPackage.findUnique({
      where: {
        stripe_priceId,
      },
    });

    if (!currentPackage) {
      throw new Error('Subscription package not found');
    }

    const { createdAt } = currentPackage;

    // Fetch packages created after the current package's creation timestamp
    const subscriptionPackages = await prisma.subscriptionPackage.findMany({
      where: {
        createdAt: {
          gt: createdAt,
        },
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    return subscriptionPackages;
  } catch (error) {
    console.error('Error fetching subscription packages:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
};


export const getSingleSubscriptionPackage = async (id:any) => {
  try {
    const subscriptionPackage = await prisma.subscriptionPackage.findUnique({
      where: {
        id: +id,
      },
    });
    return subscriptionPackage;
  } catch (error) {
    console.error('Error fetching subscription package by ID:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
};

export const updateSingleSubscriptionPackage =    async (id:any, data:any) =>{
  try {
    const updatedPackage = await prisma.subscriptionPackage.update({
      where: { id: +id },
      data: {
        price: +data.price,
        upload_video_limit: +data.uploadVideoLimit,
        generate_clips: +data.generateClips,
        updatedAt: new Date(),  // Ensure this is updated automatically by Prisma
      },
    });
    return { status: 'true', message: 'Update successful', data: updatedPackage };
  } catch (error) {
    console.error(error);
    throw new Error('Failed to update subscription package');
  }
}

