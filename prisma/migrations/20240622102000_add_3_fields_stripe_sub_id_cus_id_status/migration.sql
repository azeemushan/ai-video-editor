-- AlterTable
ALTER TABLE "Subscriptions" ADD COLUMN     "stripe_customer_id" TEXT,
ADD COLUMN     "stripe_status" TEXT,
ADD COLUMN     "stripe_subscription_id" TEXT;
