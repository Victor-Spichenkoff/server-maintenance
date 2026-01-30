/*
  Warnings:

  - You are about to drop the column `hightMenssages` on the `Api` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Api" DROP COLUMN "hightMenssages",
ADD COLUMN     "highMessages" BOOLEAN NOT NULL DEFAULT false;
