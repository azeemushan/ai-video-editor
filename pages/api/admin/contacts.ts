import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';



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
        case 'DELETE':
          await handleDELETE(req, res);
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

const handlePOST = async (req: NextApiRequest, res: NextApiResponse) => {
    const { name, email, phone, message } = req.body;
  
    if (!name || !email || !phone) {
      res.status(400).json({ error: 'Name, email, and phone are required' });
      return;
    }
  
    try {
      const newContact = await prisma.contacts.create({
        data: {
          name,
          email,
          phone,
          message,
        },
      });
  
      res.status(200).json({ status: 'true', msg: 'Your message has been sent', data: newContact});
    } catch (error) {
        res.json({ status: 'false', msg: 'Some thing went wrong', data: {}});
    } finally {
      await prisma.$disconnect();
    }
  };


  const handleGET = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      const contacts = await prisma.contacts.findMany();
      res.status(200).json({ status: 'true', data: contacts });
    } catch (error) {
      res.status(500).json({ status: 'false', msg: 'Something went wrong', data: [] });
    } finally {
      await prisma.$disconnect();
    }
  };



  const handleDELETE = async (req: NextApiRequest, res: NextApiResponse) => {
    const { id } = req.query;
  
    if (!id) {
      res.status(400).json({ error: 'ID is required' });
      return;
    }
  
    try {
      const deletedContact = await prisma.contacts.delete({
        where: {
          id: Number(id),
        },
      });
  
      res.status(200).json({ status: 'true', msg: 'Contact deleted', data: deletedContact });
    } catch (error) {
      res.status(500).json({ status: 'false', msg: 'Something went wrong', data: {} });
    } finally {
      await prisma.$disconnect();
    }
  };