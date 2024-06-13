/*
  Warnings:

  - Added the required column `subscription_type` to the `SubscriptionPackage` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "SubscriptionType" AS ENUM ('BASIC', 'PRO', 'PREMIUM');

-- AlterTable
ALTER TABLE "SubscriptionPackage" ADD COLUMN     "subscription_type" "SubscriptionType" NOT NULL;
