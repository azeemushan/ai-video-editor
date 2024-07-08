import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from '@/lib/session';
import { createVideo, getAllVideos, getVideoById, updateConVideoSrcField } from 'models/uploadedVideo';
import { updateConVideoIdField } from 'models/uploadedVideo'; // Update with the correct path
import { prisma } from '@/lib/prisma';
import ytdl from 'ytdl-core';

const extractVideoId = (url: string) => {
  const regex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  const match = url.match(regex);
  return match ? match[1] : null;
};

const getVideoDuration = async (videoId: string): Promise<number | null> => {
  try {
    const info = await ytdl.getInfo(videoId);
    const duration = info.videoDetails.lengthSeconds;
    return duration ? parseInt(duration) : null;
  } catch (error) {
    console.error('Error fetching video duration:', error);
    return null;
  }
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;

  try {
    switch (method) {
      case 'POST':
        await handlePOST(req, res);
        break;
      case 'GET':
        await handleGET(req, res);
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
  const { origionalVideoLink, fetchVideoById, updateConVidSrcById, src_url, title }: any = req.body;
  const session = await getSession(req, res);

  

  // Check usage
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
    return res.json({ status: 'false', message: 'payment required', data: 'payment' });
  }

  const latestSubscriptionUsage: any = await prisma.subscriptionUsage.findFirst({
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

  // Handle different request cases
  if (src_url) {
    const getVideo = await updateConVideoSrcField({ id: updateConVidSrcById, userId: session?.user.id, conVideoSrc: src_url, conVideoTitle: title });
    if (getVideo) {
      res.status(200).json({ status: 'true', message: 'src field and title field updated', data: getVideo });
    } else {
      res.json({ status: 'false', message: 'src field and title field not updated', data: {} });
    }
    return;
  }

  if (fetchVideoById) {
    const getVideo = await getVideoById(fetchVideoById);
    if (getVideo) {
      res.status(200).json({ status: 'true', message: 'get video object', data: getVideo });
    } else {
      res.json({ status: 'false', message: 'video object not retrieved', data: {} });
    }
    return;
  }

  if (origionalVideoLink) {
    const videoId = extractVideoId(origionalVideoLink);
    if (!videoId) {
      res.status(400).json({ status: 'false', message: 'Invalid YouTube URL', data: {} });
      return;
    }

    const videoDuration = await getVideoDuration(videoId);
    

    if (videoDuration === null) {
      res.status(500).json({ status: 'false', message: 'Failed to get video duration', data: {} });
      return;
    }

    
    // Convert max_length_video from HH:MM:SS to seconds for comparison
    const maxVideoLengthFromDB = subscription.subscriptionPackage?.max_length_video;
    let maxVideoLengthInSeconds = 0;
    if (maxVideoLengthFromDB) {
      maxVideoLengthInSeconds = timeStringToSeconds(maxVideoLengthFromDB);
    }

    // Compare video duration with max length allowed
    if (videoDuration >= maxVideoLengthInSeconds) {
      return res.status(403).json({
        status: 'false',
        message: 'Video length exceeds the maximum allowed length for your subscription package',
        data: 'video_length_exceeded',
      });
    }

    
    const videoUploaded = await createVideo({ link: origionalVideoLink, userId: session?.user.id, duration: videoDuration });
    if (videoUploaded) {
      res.status(200).json({ status: 'true', message: 'Video created', data: videoUploaded });
    } else {
      res.json({ status: 'false', message: 'Video not created', data: {} });
    }
    return;
  }
};

// Handle PUT request to update the conVideoId field
const handlePUT = async (req: NextApiRequest, res: NextApiResponse) => {
  const { conVideoId, videoId } = req.body;
  const session = await getSession(req, res);
  try {
    const updatedVideo = await updateConVideoIdField({ id: videoId, userId: session?.user.id, conVideoId });
    if (updatedVideo) {
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
              upload_count: latestSubscriptionUsage.upload_count + 1,
            },
          });

          console.log(updatedSubscriptionUsage);
        } else {
          console.log("No SubscriptionUsage record found for the latest active subscription.");
        }
      } else {
        console.log("No active subscription found for the user.");
      }
    }
    res.status(200).json({ status: 'true', message: 'Video updated', data: updatedVideo });
  } catch (error) {
    res.json({ status: 'false', message: 'convideoField not updated', data: {} });
  }
};

const handleGET = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSession(req, res);

  try {
    const videos = await getAllVideos({ userId: session?.user.id });

    const subscription = await prisma.subscriptions.findFirst({
      where: {
        user_id: session?.user.id,
        status: true,
      },
      include: {
        subscriptionPackage: true,
      },
    });

    const maxVideoLengthFromDB = subscription?.subscriptionPackage?.max_length_video; // Get the max video length from the subscription package


    // Include maxVideoLengthFromDB in the response
    res.status(200).json({
      status: 'true',
      message: 'get all videos',
      data: videos,
      maxVideoLengthFromDB: maxVideoLengthFromDB // Add this line to include the value in the response
    });
  } catch (error) {
    res.json({ status: 'false', message: 'something went wrong', data: {} });
  }
};


// Helper function to convert time string (HH:MM:SS) to seconds
function timeStringToSeconds(timeString: string): number {
  const [hours, minutes, seconds] = timeString.split(':').map(Number);
  return hours * 3600 + minutes * 60 + seconds;
}