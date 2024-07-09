import { NextApiRequest, NextApiResponse } from 'next';
import { getSubscriptionPackage,getSingleSubscriptionPackage,updateSingleSubscriptionPackage } from 'models/subscriptionPackage';
import env from '@/lib/env';
import Stripe from 'stripe';
const stripe = new Stripe(`${env.stripe.secretKey}`);
import { prisma } from '@/lib/prisma';



export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;

  try {
    switch (method) {
      case 'GET':
        await handleGET(req, res);
        break;
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
// getSingleSubPkgId

const handlePOST = async (req: NextApiRequest, res: NextApiResponse) => {
  const {getSingleSubPkgId,idToUpdateSubPkg,price,uploadVideoLimit,generateClips} =   req.body; // idToUpdateSubPkg,stripe_priceId
  


  if (idToUpdateSubPkg) {
    try {
      // upate price on stripe start
      const currentSubscriptionPackage = await getSingleSubscriptionPackage(idToUpdateSubPkg);
    
      if (!currentSubscriptionPackage) {
        return res.json({ status: 'false', message: 'Subscription package not found', data: {} });
      }
      
      // Check if the prices are not equal
      let pricesNotEqual = false;
      if (currentSubscriptionPackage.price !== price) {
        pricesNotEqual = true;

      }
      // upate price on stripe end



      const singleSubscriptionPackageUpdated = await updateSingleSubscriptionPackage(idToUpdateSubPkg, { price, uploadVideoLimit, generateClips});

      if(pricesNotEqual){
        pricesNotEqual = false
        
        const price = await stripe.prices.retrieve(singleSubscriptionPackageUpdated.data.stripe_priceId as any);
        



        const newPrice = await stripe.prices.create({
          unit_amount: ((+singleSubscriptionPackageUpdated.data.price) * 100),
          currency: price.currency,
          recurring: {
            interval: price.recurring?.interval  as any
          },
          product: price.product as any,
        });

        const subscriptions = await stripe.subscriptions.list({
          price: singleSubscriptionPackageUpdated.data.stripe_priceId as any,
        });

         for (const subscription of subscriptions.data) {
          const current_period_end = subscription.current_period_end;
          const trial_end = current_period_end;
        
          const updatedItems = subscription.items.data.map(item => ({
            id: item.id,
            price: newPrice.id,
          }));
        
          await stripe.subscriptions.update(subscription.id, {
            items: updatedItems,
            proration_behavior: 'none',
            trial_end: trial_end,
          });
        }
        const newPriceId = newPrice.id;
        await prisma.subscriptionPackage.updateMany({
          where: {
            stripe_priceId: singleSubscriptionPackageUpdated.data.stripe_priceId,
          },
          data: {
            stripe_priceId: newPriceId,
          },
        });
        await prisma.subscriptions.updateMany({
          where: {
            stripe_priceId: singleSubscriptionPackageUpdated.data.stripe_priceId,
          },
          data: {
            stripe_priceId: newPriceId,
          },
        });
        await stripe.prices.update(singleSubscriptionPackageUpdated.data.stripe_priceId as any, {
          active: false
      });
      }


      if(singleSubscriptionPackageUpdated){
        res.json({status:'true',message:"subcription package updated successfully"});
      }
      
    } catch (error) {
      res.json({ status: 'false', message: 'something went wrong', data: {} });
    }
  }



  if(getSingleSubPkgId){
  try {
    const singleSubscriptionPackage = await getSingleSubscriptionPackage(getSingleSubPkgId);
    res.json(singleSubscriptionPackage);
  } catch (error) {
    res.json({ status: 'false', message: 'some thing went wrong', data: {} });
  }
}

};

const handleGET = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const subscriptionPackages = await getSubscriptionPackage();
    res.status(200).json({ status: 'true', message: 'get all subscriptionPackages', data: subscriptionPackages });
  } catch (error) {
    res.json({ status: 'false', message: 'some thing went wrong', data: {} });
  }

};

