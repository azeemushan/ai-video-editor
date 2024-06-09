import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from '@/lib/session';
import { createVideo, getAllVideos, getVideoById, updateConVideoSrcField } from 'models/uploadedVideo';
import { updateConVideoIdField } from 'models/uploadedVideo'; // Update with the correct path




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
  const { origionalVideoLink,fetchVideoById,updateConVidSrcById,src_url,title }:any = req.body;
  const session = await getSession(req, res);

  if(src_url){
    const getVideo = await updateConVideoSrcField({id:updateConVidSrcById,userId:session?.user.id,conVideoSrc:src_url,conVideoTitle:title});
    if (getVideo) {
      res.status(200).json({ status: 'true', message: 'src field and tiltle field updated', data: getVideo });
    } else {
      res.json({ status: 'false', message: 'src field and tiltle field not updated', data: {} });
    }
  

  }

  if(fetchVideoById){
    const getVideo = await getVideoById(fetchVideoById);
  if (getVideo) {
    res.status(200).json({ status: 'true', message: 'get video object', data: getVideo });
  } else {
    res.json({ status: 'false', message: 'video object not get', data: {} });
  }

  }

  
  if(origionalVideoLink){
  const videoUploaded = await createVideo({ link: origionalVideoLink, userId: session?.user.id });
  if (videoUploaded) {
    res.status(200).json({ status: 'true', message: 'Video created', data: videoUploaded });
  } else {
    res.json({ status: 'false', message: 'Video not created', data: {} });
  }
}


};

// Handle PUT request to update the conVideoId field
const handlePUT = async (req: NextApiRequest, res: NextApiResponse) => {
  const {  conVideoId,videoId ,conVideoSrc} = req.body;
  console.log(`=============================================src`)
  console.log(conVideoSrc)

  const session = await getSession(req, res);
// put request to update conVideoSrc



// put request to update conVideoId

  try {
    const updatedVideo = await updateConVideoIdField({ id:videoId,userId:session?.user.id, conVideoId });
    res.status(200).json({ status: 'true', message: 'Video updated', data: updatedVideo });
  } catch (error) {
    res.json({ status: 'false', message: 'convideoField not updated', data: {} });
  }


};

const handleGET = async (req: NextApiRequest, res: NextApiResponse) => {
  

  const session = await getSession(req, res);
// put request to update conVideoSrc



// put request to update conVideoId

  try {
    const videos = await getAllVideos({ userId:session?.user.id});
    res.status(200).json({ status: 'true', message: 'get all videos', data: videos });
  } catch (error) {
    res.json({ status: 'false', message: 'some thing went wrong', data: {} });
  }


};

