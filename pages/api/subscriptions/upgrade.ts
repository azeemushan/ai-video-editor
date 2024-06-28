import { NextApiRequest, NextApiResponse } from 'next';
import { stripe } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';

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

const handlePOST = async (req: NextApiRequest, res: NextApiResponse) => {
  const { subscriptionId, newPriceId } = req.body;

  // try {
  //   // Retrieve the current subscription
  //   const subscription = await stripe.subscriptions.retrieve(subscriptionId);
  
  //   // Retrieve the new price data
  //   const newPriceData = await stripe.prices.retrieve(newPriceId);
  //   const newPrice = newPriceData.unit_amount;
  //   const oldPrice = subscription.items.data[0].price?.unit_amount;
  
  //   // Ensure newPrice and oldPrice are not null
  //   if (newPrice === null || oldPrice === null) {
  //     throw new Error('Price data is invalid.');
  //   }
  
  //   // Calculate the difference amount
  //   const differenceAmount = newPrice - oldPrice;
  
  //   // Create an invoice item for the difference amount only if it is positive
  //   if (differenceAmount > 0) {
  //     await stripe.invoiceItems.create({
  //       customer: subscription.customer as string,
  //       amount: differenceAmount,
  //       currency: 'usd',
  //       description: 'Upgrade charge',
  //     });
  
  //     // Create and finalize the invoice immediately to charge the user
  //     const invoice = await stripe.invoices.create({
  //       customer: subscription.customer as string,
  //       collection_method: 'charge_automatically',
  //     });
  
  //     await stripe.invoices.finalizeInvoice(invoice.id, { auto_advance: true });
  //   }
  
  //   // Update the subscription to the new price without prorating
  //   const updatedSubscription = await stripe.subscriptions.update(subscriptionId, {
  //     billing_cycle_anchor: 'now',
  //     items: [{
  //       id: subscription.items.data[0].id,
  //       price: newPriceId,
  //     }],
  //     proration_behavior: 'none', // No proration handled by subscription update
  //   });
  
  //   res.status(200).json({ status: 'true', msg: 'Subscription upgraded and upgrade charge applied', data: updatedSubscription });
  // } catch (error: any) {
  //   console.error('Error upgrading subscription:', error);
  //   res.status(500).json({ status: 'false', msg: 'Something went wrong', error: error.message || error });
  // }


  // try {
  //   // Retrieve the current subscription
  //   const subscription = await stripe.subscriptions.retrieve(subscriptionId);
  
  //   // Retrieve the new price data
  //   const newPriceData = await stripe.prices.retrieve(newPriceId);
  //   const newPrice = newPriceData.unit_amount;
  //   const oldPrice = subscription.items.data[0].price?.unit_amount;
  
  //   // Ensure newPrice and oldPrice are not null
  //   if (newPrice === null || oldPrice === null) {
  //     throw new Error('Price data is invalid.');
  //   }
  
  //   // Calculate the difference amount
  //   const differenceAmount = newPrice - oldPrice;
  
  //   // Charge the user for the difference amount for this month
  //   if (differenceAmount > 0) {
  //     // Create an invoice item for the difference amount
  //       await stripe.invoiceItems.create({
  //       customer: subscription.customer as any,
  //       amount: differenceAmount,
  //       currency: 'usd',
  //       description: 'Upgrade charge',
  //     });
  
  //     // Create and finalize the invoice immediately to charge the user
  //     const invoice = await stripe.invoices.create({
  //       customer: subscription.customer as any,
  //       collection_method: 'charge_automatically',
  //     });
  
  //     await stripe.invoices.finalizeInvoice(invoice.id, { auto_advance: true });
  //   }
  
  //   // Update the subscription to the new price without prorating
  //   const updatedSubscription = await stripe.subscriptions.update(subscriptionId, {
  //     items: [{
  //       id: subscription.items.data[0].id,
  //       price: newPriceId,
  //     }],
  //     proration_behavior: 'none', // No proration handled by subscription update
  //   });
  
  //   res.status(200).json({ status: 'true', msg: 'Subscription upgraded and upgrade charge applied', data: updatedSubscription });
  // } catch (error:any) {
  //   console.error('Error upgrading subscription:', error);
  //   res.status(500).json({ status: 'false', msg: 'Something went wrong', error: error.message || error });
  // }
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

    // Charge the user for the difference amount for this month
    // if (differenceAmount > 0) {
    //   // Create an invoice item for the difference amount
    //   await stripe.invoiceItems.create({
    //     customer: subscription.customer as string,
    //     amount: differenceAmount,
    //     currency: 'usd',
    //     description: 'Upgrade charge',
    //   });

    //   // Create and finalize the invoice immediately to charge the user
    //   const invoice = await stripe.invoices.create({
    //     customer: subscription.customer as string,
    //     collection_method: 'charge_automatically',
    //     auto_advance: true, // Finalize and pay the invoice immediately
    //   });

    //   await stripe.invoices.finalizeInvoice(invoice.id);
    // }
      

  
    // Update the subscription to the new price without prorating
    const updatedSubscription = await stripe.subscriptions.update(subscriptionId, {
      items: [{
        id: subscription.items.data[0].id,
        price: newPriceId,
      }],
      proration_behavior: 'none',
    });
    
    
    
    // Extract the plan from the first item in the subscription items list
    const plan = updatedSubscription.items.data[0].plan;
const interval = plan.interval.toUpperCase(); // convert interval to uppercase


// Fetch the product details using the product ID
const productId = plan.product;

let product;
try {
  product = await stripe.products.retrieve(productId as any);  // product.name will convert to uppercase
} catch (error:any) {
  
  throw new Error('Product retrieval failed');
}

const yearlySubPkgBasic = await prisma.subscriptionPackage.findFirst({
  where: {
    subscription_type: 'BASIC',
    sub_dur_type: 'YEARLY',
  },
});
// const yearlySubPkgPro = await prisma.subscriptionPackage.findFirst({
//   where: {
//     subscription_type: 'PRO',
//     sub_dur_type: 'YEARLY',
//   },
// });
// const yearlySubPkgPremium = await prisma.subscriptionPackage.findFirst({
//   where: {
//     subscription_type: 'PREMIUM',
//     sub_dur_type: 'YEARLY',
//   },
// });


if (
  yearlySubPkgBasic?.subscription_type !== product.name.toUpperCase() &&
  yearlySubPkgBasic?.sub_dur_type !== interval 
  // ||
  // yearlySubPkgPro?.subscription_type !== product.name.toUpperCase() &&
  // yearlySubPkgPro?.sub_dur_type !== interval ||
  // yearlySubPkgPremium?.subscription_type !== product.name.toUpperCase() &&
  // yearlySubPkgPremium?.sub_dur_type !== interval

) {
  try {
    await stripe.paymentIntents.create({
      amount: differenceAmount,
      currency: 'usd',
      customer: subscription.customer as string,
      payment_method: subscription.default_payment_method as string,
      off_session: true,
      confirm: true,
      description: 'Upgrade charge',
    });
  } catch (error:any) {
    console.error(`Failed to create payment intent: ${error.message}`);
    throw new Error('Payment intent creation failed');
  }
}


    
    
    
    

    res.status(200).json({ status: 'true', msg: 'Subscription upgraded and upgrade charge applied', data: updatedSubscription });
  } catch (error: any) {
    console.error('Error upgrading subscription:', error);
    res.status(500).json({ status: 'false', msg: 'Something went wrong', error: error.message || error });
  }

  
  
  
  
};
