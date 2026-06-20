/*
  Warnings:

  - You are about to drop the column `LastCalledSucessfully` on the `Server` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Server" DROP COLUMN "LastCalledSucessfully",
ADD COLUMN     "LastCalledSuccessfully" BIGINT;
