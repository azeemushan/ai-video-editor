import { prisma } from '@/lib/prisma';
export const getSubscriptionPackage = async () => {
  try {
    const subscriptionPackages = await prisma.subscriptionPackage.findMany();
    return subscriptionPackages;
  } catch (error) {
    console.error('Error fetching subscription Packages:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
};
