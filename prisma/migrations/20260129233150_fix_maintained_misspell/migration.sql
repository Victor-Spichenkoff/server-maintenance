/*
  Warnings:

  - You are about to drop the column `currentMantenedName` on the `Api` table. All the data in the column will be lost.
  - You are about to drop the column `currentMantenedUrl` on the `Api` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Api" DROP COLUMN "currentMantenedName",
DROP COLUMN "currentMantenedUrl",
ADD COLUMN     "currentMaintainedName" TEXT NOT NULL DEFAULT 'Nothing Selected',
ADD COLUMN     "currentMaintainedUrl" TEXT NOT NULL DEFAULT 'https://google.com';
