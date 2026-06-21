/*
  Warnings:

  - You are about to drop the column `callOnAll` on the `Server` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Server" DROP COLUMN "callOnAll",
ADD COLUMN     "isMain" BOOLEAN NOT NULL DEFAULT false;
