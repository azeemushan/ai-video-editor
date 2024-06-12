-- CreateEnum
CREATE TYPE "UserType" AS ENUM ('USER', 'ADMIN');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "user_type" "UserType" NOT NULL DEFAULT 'USER';

-- CreateTable
CREATE TABLE "SubscriptionPackage" (
    "id" SERIAL NOT NULL,
    "price" INTEGER NOT NULL,
    "upload_video_limit" INTEGER NOT NULL,
    "generate_clips" INTEGER NOT NULL,
    "max_length_video" TEXT NOT NULL,
    "total_min" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SubscriptionPackage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Subscriptions" (
    "id" SERIAL NOT NULL,
    "subscription_pkg_id" INTEGER NOT NULL,
    "user_id" TEXT NOT NULL,
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Subscriptions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SubscriptionUsage" (
    "id" SERIAL NOT NULL,
    "subscriptions_id" INTEGER NOT NULL,
    "upload_count" INTEGER NOT NULL,
    "clip_count" INTEGER NOT NULL,
    "min" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SubscriptionUsage_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Subscriptions" ADD CONSTRAINT "Subscriptions_subscription_pkg_id_fkey" FOREIGN KEY ("subscription_pkg_id") REFERENCES "SubscriptionPackage"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subscriptions" ADD CONSTRAINT "Subscriptions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubscriptionUsage" ADD CONSTRAINT "SubscriptionUsage_subscriptions_id_fkey" FOREIGN KEY ("subscriptions_id") REFERENCES "Subscriptions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
