/*
  Warnings:

  - A unique constraint covering the columns `[stripe_priceId]` on the table `SubscriptionPackage` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Subscriptions" DROP CONSTRAINT "Subscriptions_subscription_pkg_id_fkey";

-- AlterTable
ALTER TABLE "Subscriptions" ALTER COLUMN "stripe_priceId" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "SubscriptionPackage_stripe_priceId_key" ON "SubscriptionPackage"("stripe_priceId");

-- AddForeignKey
ALTER TABLE "Subscriptions" ADD CONSTRAINT "Subscriptions_stripe_priceId_fkey" FOREIGN KEY ("stripe_priceId") REFERENCES "SubscriptionPackage"("stripe_priceId") ON DELETE CASCADE ON UPDATE CASCADE;
