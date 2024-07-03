import { prisma } from '@/lib/prisma';
export const getSubscription = async () => {
  try {
    const subscriptions =  await prisma.subscriptions.findMany({
        include: {
          subscriptionPackage: true,
          user: true,
        },
      });
    return subscriptions;
  } catch (error) {
    console.error('Error fetching subscription Packages:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
};

export const deleteStripeSubscription = async (id: string) => {
  return await prisma.subscriptions.deleteMany({
    where: {
      stripe_subscriptionId:id
    },
  });
};




