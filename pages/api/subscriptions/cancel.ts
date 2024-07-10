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
  const { subscriptionId } = req.body;
  const session = await getSession(req, res);
  
  try {
     await stripe.subscriptions.update(subscriptionId, {
      cancel_at_period_end: true,
    });


    const pollForCancelUpdate = async (retryCount = 0): Promise<void> => {
      const updatedSubscription = await prisma.subscriptions.findFirst({
        where: { status: true,user_id:session?.user.id },
        include: {
          subscriptionPackage: true, 
          subscriptionUsage: true 
        }
        
      });

      if (updatedSubscription && updatedSubscription.cancelAt !== null) {
        res.status(200).json({ status: 'true', msg: 'Subscription cancellation scheduled', data: updatedSubscription });
      } else if (retryCount * POLL_INTERVAL >= POLL_TIMEOUT) {
        res.status(500).json({ status: 'false', msg: 'Subscription cancellation scheduling timed out' });
      } else {
        setTimeout(() => pollForCancelUpdate(retryCount + 1), POLL_INTERVAL);
      }
    };

    await pollForCancelUpdate();
  } catch (error) {
    console.error('Error cancelling subscription:', error);
    res.status(500).json({ error: 'Failed to cancel subscription' });
  }







    
    
    
    



  
  
  
  
};
