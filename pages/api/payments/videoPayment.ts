import env from '@/lib/env';
import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';
import { getSession } from '@/lib/session';
import { prisma } from '@/lib/prisma';

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

  if (!session?.user) {
    res.json({
      status: 'true',
      message: 'redirect to payment',
      data: {
        url: `${env.appUrl}/auth/login?callbackUrl=${encodeURIComponent(env.appUrl + '/pricing')}`,
      },
    });
    return; // Ensure to return here to stop further execution
  }

  const { id, price } = req.body;
  // first check if subscription show message on front that subscription exist please upgrade or cancel existing subscription

  const subscription = await prisma.subscriptions.findFirst({
    where: {
      user_id: session?.user.id,
      status: true,
    },
    include: {
      subscriptionPackage: true,
    },
  });

  if (subscription) {
    
    return res.json({
      status: 'subscription exist',
      message: 'An active subscription already exists. Please upgrade or cancel your current subscription to proceed.',
      data: {  },
    });
  }

  const subscriptionPackage = await prisma.subscriptionPackage.findUnique({
    where: {
      id: parseInt(id),
    },
  });
  if (price) {
    try {
      const str_session = await stripe.checkout.sessions.create({
        metadata: {
          sub_package_id: id,
          userId: session?.user.id as any,
        },
        payment_method_types: ['card'],
        line_items: [
          {
            price: subscriptionPackage?.stripe_priceId as any, // Use the existing price ID
            quantity: subscriptionPackage?.sub_dur_type === 'MONTHLY' ? 1 : 12,
          },
        ],
        mode: 'subscription',
        subscription_data: {
          metadata: {
            sub_package_id: id,
            userId: session?.user.id,
          },
        },
        success_url: `${env.appUrl}/payments/paymentSuccess`,
        cancel_url: `${env.appUrl}/payments/paymentFail`,
      });

      if (subscriptionPackage) {
        res.status(200).json({
          status: 'true',
          message: 'redirect to payment',
          data: { url: str_session.url, sub_package_id: id },
        });
      }
    } catch (err) {
      console.log(err);
      res.json({ status: 'false', message: 'payment not done', data: {} });
    }
  } else {
    res
      .status(400)
      .json({ status: 'false', message: 'Price not provided', data: {} });
  }
};
