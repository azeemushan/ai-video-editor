import { NextApiRequest, NextApiResponse } from 'next';





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
  const {  }: any = req.body;
  
try{
  res
        .status(200)
        .json({ status: 'true', message: 'video clip created', data: {}});
  
} catch(err){
  res.json({ status: 'false', message: 'payment not done', data: {} });

} 
    



}




