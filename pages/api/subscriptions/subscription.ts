import { NextApiRequest, NextApiResponse } from 'next';
import { getSubscription } from 'models/subscriptions';
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
const handleGET = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const allSubscriptions = await getSubscription();
    res.status(200).json({ status: 'true', message: 'get all allSubscriptions', data: allSubscriptions });
  } catch (error) {
    res.json({ status: 'false', message: 'some thing went wrong', data: {} });
  }

};


const handlePOST = async (req: NextApiRequest, res: NextApiResponse) => {
  const { userId, status } = req.body;

  try {
    // Fetch subscriptions based on userId and status
    const subscription = await prisma.subscriptions.findFirst({
      where: {
        user_id: userId,
        status: status
      },
      include: {
        subscriptionPackage: true, 
        subscriptionUsage: true 
      }
    });
    
    
    
    if (subscription) {
      res.status(200).json({ status: 'true', message: 'subscription found', data: subscription });
    } else {
      res.status(404).json({ status: 'false', message: 'no active subscription found', data: {} });
    }
  } catch (error) {
    res.status(500).json({ status: 'false', message: 'something went wrong', data: {} });
  }
};

