import env from '@/lib/env';
import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';
import { getSession } from '@/lib/session';


const stripe = new Stripe(`${env.stripe.secretKey}`);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
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

// Handle POST request to create a video
const handlePOST = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSession(req, res);
  
  if(!session?.user){
    res
      .json({
        status: 'true',
        message: 'redirect to payment',
        data: { url: `${env.appUrl}/auth/login?callbackUrl=${encodeURIComponent(env.appUrl + '/pricing')}` },
      });

  }

  
  const { price, Subscription_type } = req.body;
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: Subscription_type,
            },
            unit_amount: ((+price) * 100),
          },

          quantity: 1,
        },
      ],
      mode: 'payment',

      success_url: `${process.env.APP_URL}/payments/paymentSuccess`,
      cancel_url: `${process.env.APP_URL}/payments/paymentFail`,
    });

    res
      .status(200)
      .json({
        status: 'true',
        message: 'redirect to payment',
        data: { url: session.url },
      });
  } catch (err) {
    console.log(err)
    res.json({ status: 'false', message: 'payment not done', data: {} });
  }
};
