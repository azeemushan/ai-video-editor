/*
  Warnings:

  - A unique constraint covering the columns `[exportId]` on the table `VideoClips` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "VideoClips_exportId_key" ON "VideoClips"("exportId");
