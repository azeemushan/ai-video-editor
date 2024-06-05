import { NextApiRequest, NextApiResponse } from 'next';

import { createVideoClip, getVideoClipsByVId, updateVideoClip } from 'models/videoClips';



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
  const {clip_id,title,src_url}:any = req.body;

  try {
    const updatedVideo = await updateVideoClip({ title,src_url,clip_id });
    res.status(200).json({ status: 'true', message: 'Video clips updated', data: updatedVideo });
  } catch (error) {
    res.json({ status: 'false', message: 'video clips not updated', data: {} });
  }


};
