import { NextApiRequest, NextApiResponse } from 'next';
import { getSubscriptionPackage,getSingleSubscriptionPackage,updateSingleSubscriptionPackage } from 'models/subscriptionPackage';

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
// getSingleSubPkgId

const handlePOST = async (req: NextApiRequest, res: NextApiResponse) => {
  const {getSingleSubPkgId,idToUpdateSubPkg,price,uploadVideoLimit,generateClips} =   req.body;

  if (idToUpdateSubPkg) {
    try {
      const singleSubscriptionPackageUpdated = await updateSingleSubscriptionPackage(idToUpdateSubPkg, { price, uploadVideoLimit, generateClips});
      if(singleSubscriptionPackageUpdated){
        res.json({status:'true',message:"subcription package updated successfully"});
      }
      
    } catch (error) {
      res.json({ status: 'false', message: 'something went wrong', data: {} });
    }
  }



  if(getSingleSubPkgId){
  try {
    const singleSubscriptionPackage = await getSingleSubscriptionPackage(getSingleSubPkgId);
    res.json(singleSubscriptionPackage);
  } catch (error) {
    res.json({ status: 'false', message: 'some thing went wrong', data: {} });
  }
}

};

const handleGET = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const subscriptionPackages = await getSubscriptionPackage();
    res.status(200).json({ status: 'true', message: 'get all subscriptionPackages', data: subscriptionPackages });
  } catch (error) {
    res.json({ status: 'false', message: 'some thing went wrong', data: {} });
  }

};

