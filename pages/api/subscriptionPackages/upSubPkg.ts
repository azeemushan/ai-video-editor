import { NextApiRequest, NextApiResponse } from 'next';
import { getUpSubscriptionPackage } from 'models/subscriptionPackage';

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
// getSingleSubPkgId

const handlePOST = async (req: NextApiRequest, res: NextApiResponse) => {
  const {stripe_priceId} =   req.body;
  try {
    const subscriptionPackages = await getUpSubscriptionPackage(stripe_priceId);
    res.status(200).json({ status: 'true', message: 'get all subscriptionPackages', data: subscriptionPackages });
  } catch (error) {
    res.json({ status: 'false', message: 'some thing went wrong', data: {} });
  }






};



