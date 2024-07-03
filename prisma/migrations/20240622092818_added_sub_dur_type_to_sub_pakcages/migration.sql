/*
  Warnings:

  - Added the required column `sub_dur_type` to the `SubscriptionPackage` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "SubDurType" AS ENUM ('MONTHLY', 'YEARLY');

-- AlterTable
ALTER TABLE "SubscriptionPackage" ADD COLUMN     "sub_dur_type" "SubDurType" NOT NULL;
