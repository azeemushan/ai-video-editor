import { NextApiRequest, NextApiResponse } from 'next';

import { createVideoClip, getVideoClipsByVId, updateVideoClip } from 'models/videoClips';
import { getSession } from '@/lib/session';
import { prisma } from '@/lib/prisma';




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
      case 'PUT': // Add PUT method to handle updates
        await handlePUT(req, res);
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
  const { conVideoId, clip_id, exportId, videoId,videoIdForClips }: any = req.body;
  const session = await getSession(req, res);
  if(videoIdForClips){
    const getVideoClips = await getVideoClipsByVId(videoIdForClips);
    if (getVideoClips) {
      res
        .status(200)
        .json({ status: 'true', message: 'video clip created', data: getVideoClips });
    } else {
      res.json({ status: 'false', message: 'video clip created', data: {} });
    }

  }

  if(videoId){
//  check usage
const subscription = await prisma.subscriptions.findFirst({
  where: {
    user_id: session?.user.id,
    status: true,
  },
  include: {
    subscriptionPackage: true,
  },
});

if (!subscription) {
  return  res.json({ status: 'false', message: 'payment required', data: 'payment' });
}
const latestSubscriptionUsage:any = await prisma.subscriptionUsage.findFirst({
  where: {
    subscriptions_id: subscription.id,
  },
  orderBy: {
    createdAt: 'desc',
  },
});

if (
  subscription.subscriptionPackage &&
  (latestSubscriptionUsage.upload_count >= subscription.subscriptionPackage.upload_video_limit ||
    latestSubscriptionUsage.clip_count >= subscription.subscriptionPackage.generate_clips)
) {
  return res.json({ status: 'false', message: 'payment required', data: 'payment' });
}

//  check usage

    





  const getVideo = await createVideoClip({
    conVideoId,
    clip_id,
    exportId,
    videoId,
  });
  if (getVideo) {
    res
      .status(200)
      .json({ status: 'true', message: 'video clip created', data: getVideo });
  } else {
    res.json({ status: 'false', message: 'video clip created', data: {} });
  }
};
}



const handlePUT = async (req: NextApiRequest, res: NextApiResponse) => {
  const { exportArray }: any = req.body;
  const session = await getSession(req, res);

  try {
    const exportParse = JSON.parse(exportArray);
    console.log(exportParse)
    let countForRes = 0;

    for (const clip of exportParse) {
      const updateVideo =  await updateVideoClip({ title: clip.name, src_url: clip.src_url, clip_id: clip.id });
      if(updateVideo){
        countForRes++

      }
    }
    if(countForRes ===exportParse.length){
      //=================
      const latestActiveSubscription = await prisma.subscriptions.findFirst({
        where: {
          user_id: session?.user.id,
          status: true,
        },
        orderBy: {
          createdAt: 'desc', // Sort by start_date in descending order to get the latest subscription
        },
      });
      
      if (latestActiveSubscription) {
        const subscriptionId = latestActiveSubscription.id;
      
        // Step 2: Retrieve the latest SubscriptionUsage record for that subscription
        const latestSubscriptionUsage = await prisma.subscriptionUsage.findFirst({
          where: {
            subscriptions_id: subscriptionId,
          },
          orderBy: {
            createdAt: 'desc', // Sort by createdAt in descending order to get the latest usage record
          },
        });
      
        if (latestSubscriptionUsage) {
          // Step 3: Update the upload_count of that record by incrementing it by one
          const updatedSubscriptionUsage = await prisma.subscriptionUsage.update({
            where: {
              id: latestSubscriptionUsage.id,
            },
            data: {
              clip_count: latestSubscriptionUsage.clip_count + countForRes,
            },
          });
      
          console.log(updatedSubscriptionUsage);
        } else {
          console.log("No SubscriptionUsage record found for the latest active subscription.");
        }
      } else {
        console.log("No active subscription found for the user.");
      }
      //=================
      countForRes=0
      res.status(200).json({ status: 'true', message: 'Video clips updated', data: {} });

    }else {
      countForRes=0
      res.status(500).json({ status: 'false', message: 'Not all video clips were updated', data: {} });
    }

    

  } catch (error) {
    console.error('Error updating video clips:', error);
    res.status(500).json({ status: 'false', message: 'Video clips not updated', data: {} });
  }
};
