/*
  Warnings:

  - You are about to drop the column `stripe_customer_id` on the `Subscriptions` table. All the data in the column will be lost.
  - You are about to drop the column `stripe_status` on the `Subscriptions` table. All the data in the column will be lost.
  - You are about to drop the column `stripe_subscription_id` on the `Subscriptions` table. All the data in the column will be lost.
  - Added the required column `stripe_customerId` to the `Subscriptions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `stripe_priceId` to the `Subscriptions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `stripe_subscriptionId` to the `Subscriptions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Subscriptions" DROP COLUMN "stripe_customer_id",
DROP COLUMN "stripe_status",
DROP COLUMN "stripe_subscription_id",
ADD COLUMN     "cancelAt" TIMESTAMP(3),
ADD COLUMN     "stripe_customerId" TEXT NOT NULL,
ADD COLUMN     "stripe_priceId" TEXT NOT NULL,
ADD COLUMN     "stripe_subscriptionId" TEXT NOT NULL,
ALTER COLUMN "status" SET DEFAULT false,
ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP;
