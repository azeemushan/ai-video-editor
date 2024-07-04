import Stripe from 'stripe';
import { stripe } from '@/lib/stripe';
import type { NextApiRequest, NextApiResponse } from 'next';
import env from '@/lib/env';
import { prisma } from '@/lib/prisma';

import type { Readable } from 'node:stream';
import { getBySubscriptionId } from 'models/subscription';

export const config = {
  api: {
    bodyParser: false,
  },
};

// Get raw body as string
async function getRawBody(readable: Readable): Promise<Buffer> {
  const chunks: any[] = [];
  for await (const chunk of readable) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks);
}

const relevantEvents: Stripe.Event.Type[] = [
  'customer.subscription.created',
  'customer.subscription.updated',
  'customer.subscription.deleted',
  'checkout.session.completed', // Added the checkout session completed event
  'charge.succeeded',
  'invoice.payment_failed',
];

export default async function POST(req: NextApiRequest, res: NextApiResponse) {
  const rawBody = await getRawBody(req);

  const sig = req.headers['stripe-signature'] as string;
  const { webhookSecret } = env.stripe;
  let event: Stripe.Event;

  try {
    if (!sig || !webhookSecret) {
      return;
    }
    event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);
    // console.log('Event received from Stripe:', event);
  } catch (err: any) {
    return res.status(400).json({ error: { message: err.message } });
  }

  if (relevantEvents.includes(event.type)) {
    try {
      switch (event.type) {
        case 'customer.subscription.created':
          await handleSubscriptionCreated(event);
          break;
        case 'customer.subscription.updated':
          await handleSubscriptionUpdated(event);
          break;
        case 'customer.subscription.deleted':
          await handleSubscriptionDeleted(event);
          break;
        case 'checkout.session.completed':
          await handleCheckoutSessionCompleted(event);
          break;
          case 'invoice.payment_failed':
            await handleInvoicePaymentFailed(event);
            break;
          
        default:
          throw new Error('Unhandled relevant event!');
      }
    } catch (error) {
      return res.status(400).json({
        error: {
          message: 'Webhook handler failed. View your Next.js function logs.',
        },
      });
    }
  }
  return res.status(200).json({ received: true });
}
async function handleSubscriptionDeleted(event: Stripe.Event) {
  const { id, canceled_at } = event.data.object as Stripe.Subscription;
  await prisma.subscriptions.updateMany({
    where: { stripe_subscriptionId: id },
    data: { cancelAt: new Date((canceled_at as any) * 1000), status: false },
  });
}
async function handleSubscriptionUpdated(event: Stripe.Event) {
  const {
    cancel_at,
    id,
    status,
    current_period_end,
    current_period_start,
    
    items,
  } = event.data.object as Stripe.Subscription;
  // console.log(`subscription udpated ================================`);
  // console.log(event);
  // console.log(metadata);
  // console.log(`subscription udpated ================================`);

  await getBySubscriptionId(id);

  const priceId = items.data.length > 0 ? items.data[0].plan?.id : '';
  await prisma.subscriptions.updateMany({
    where: { stripe_subscriptionId: id },
    data: {
      start_date: current_period_start
        ? new Date(current_period_start * 1000)
        : undefined,
      end_date: current_period_end
        ? new Date(current_period_end * 1000)
        : undefined,
      stripe_priceId: priceId,
      cancelAt: cancel_at ? new Date((cancel_at as any) * 1000) : null,
      status: status === 'active' || status === 'trialing',
    },
  });

  


}

async function handleSubscriptionCreated(event: Stripe.Event) {
  const {
    customer,
    id,
    current_period_start,
    current_period_end,
    items,
    metadata,
  } = event.data.object as Stripe.Subscription;

  const newSubscription = await prisma.subscriptions.create({
    data: {
      subscription_pkg_id: +metadata.sub_package_id,
      user_id: metadata.userId,
      start_date: new Date(current_period_start * 1000),
      end_date: new Date(current_period_end * 1000),
      stripe_subscriptionId: id,
      stripe_customerId: customer as string,
      stripe_priceId: items.data.length > 0 ? items.data[0].plan?.id : '',
      status: true,
    },
  });
  await prisma.subscriptionUsage.create({
    data: {
      subscriptions_id: newSubscription.id,
      upload_count: 0,
      clip_count: 0,
      min: 0,
    },
  });
}

async function handleCheckoutSessionCompleted(event: Stripe.Event) {
  const session = event.data.object as Stripe.Checkout.Session;
  // console.log(`session checkout completed ==========`);
  // console.log(session);

  // Retrieve the subscription
  const subscription = await stripe.subscriptions.retrieve(
    session.subscription as string
  );

  // console.log(`Subscription details ==========`);
  // console.log(subscription);

  // Set the default payment method for the customer
  if (subscription.default_payment_method) {
    await stripe.customers.update(subscription.customer as string, {
      invoice_settings: {
        default_payment_method: subscription.default_payment_method as string,
      },
    });
    console.log('Default payment method set for the customer.');
  } else {
    console.error('subscription.default_payment_method is null');
  }

  // Continue with any additional logic needed for handling a completed checkout session
  // ...
}

async function handleInvoicePaymentFailed(event: Stripe.Event) {
  const { subscription } = event.data.object as Stripe.Invoice;

  // Delete the subscription from Stripe
  if (subscription) {
    
     await stripe.subscriptions.cancel(
      subscription as string
    );
    console.log(`Subscription ${subscription} deleted due to payment failure.`);
  } else {
    console.error('No subscription found in the failed invoice event.');
  }
}
