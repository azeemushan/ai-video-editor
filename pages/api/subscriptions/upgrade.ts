import { NextApiRequest, NextApiResponse } from 'next';
import { stripe } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/session';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;


  try {
    switch (method) {
      case 'POST':
        await handlePOST(req, res);
        break;
      default:
        res.setHeader('Allow', 'GET, POST, PUT');
        res.status(405).json({
          error: { message: `Method ${method} Not Allowed` },
        });
    }
  } catch (error: any) {
    const message = error.message || 'Something went wrong';
    const status = error.status || 500;
    res.status(status).json({ error: { message } });
  }
}
const POLL_INTERVAL = 1000; // 1 second
const POLL_TIMEOUT = 30000; // 30 seconds
const handlePOST = async (req: NextApiRequest, res: NextApiResponse) => {
  const { subscriptionId, newPriceId } = req.body;
  const session = await getSession(req, res);

  try {
    // Retrieve the current subscription
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    
  
    // Retrieve the new price data
    const newPriceData = await stripe.prices.retrieve(newPriceId);
    
    const newPrice = newPriceData.unit_amount;
    const oldPrice = subscription.items.data[0].price?.unit_amount;
  
    // Ensure newPrice and oldPrice are not null
    if (newPrice === null || oldPrice === null) {
      throw new Error('Price data is invalid.');
    }
  
    // Calculate the difference amount
    const differenceAmount = newPrice - oldPrice;
  
    // Create an invoice item for the difference amount only if it is positive
    if (differenceAmount > 0) {
      
  
      // Create and finalize the invoice immediately to charge the user
      const invoice = await stripe.invoices.create({
        customer: subscription.customer as string,
        collection_method: 'charge_automatically',
      });
      await stripe.invoiceItems.create({
        customer: subscription.customer as string,
        amount: differenceAmount,
        currency: 'usd',
        description: 'Upgrade charge',
        invoice:invoice.id
      });
  
      // await stripe.invoices.finalizeInvoice(invoice.id, { auto_advance: true });

 await stripe.invoices.pay(invoice.id);
    }
    // Update the subscription to the new price without prorating
    const intervalToBUp = newPriceData.recurring?.interval;
    const plan = subscription.items.data[0].plan;
    let trial_end: number | undefined = undefined;
    if (plan.interval === 'month' && intervalToBUp === 'month') {
      trial_end = subscription.current_period_end;
    } else if (intervalToBUp === 'year') {
      const startDate = subscription.current_period_start;
      trial_end = startDate + 365 * 24 * 60 * 60; // Add 1 year in seconds
    }
    
     await stripe.subscriptions.update(subscriptionId, {
      
      items: [{
        id: subscription.items.data[0].id,
        price: newPriceId,
      }],
      proration_behavior: 'none', // No proration handled by subscription update
      trial_end
      

      
    });
    const pollForUpdate = async (retryCount = 0): Promise<void> => {
      const updatedSubscription = await prisma.subscriptions.findFirst({
        where: { status: true,user_id:session?.user.id },
        include: {
          subscriptionPackage: true, 
          subscriptionUsage: true 
        }
        
      });

      if (updatedSubscription && updatedSubscription.stripe_priceId === newPriceId) {
        res.status(200).json({ status: 'true', msg: 'Subscription upgraded and upgrade charge applied', data: updatedSubscription });
      } else if (retryCount * POLL_INTERVAL >= POLL_TIMEOUT) {
        res.status(500).json({ status: 'false', msg: 'Subscription upgrade timed out' });
      } else {
        setTimeout(() => pollForUpdate(retryCount + 1), POLL_INTERVAL);
      }
    };

    await pollForUpdate();


  
    // res.status(200).json({ status: 'true', msg: 'Subscription upgraded and upgrade charge applied', data: updatedSubscription });
  } catch (error: any) {
    console.error('Error upgrading subscription:', error);
    res.status(500).json({ status: 'false', msg: 'Something went wrong', error: error.message || error });
  }


  
  
};
