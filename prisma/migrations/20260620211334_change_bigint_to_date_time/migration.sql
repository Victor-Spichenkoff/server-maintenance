/*
  Warnings:

  - The `LastCalled` column on the `Server` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `LastCalledSuccessfully` column on the `Server` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Server" DROP COLUMN "LastCalled",
ADD COLUMN     "LastCalled" TIMESTAMP(3),
DROP COLUMN "LastCalledSuccessfully",
ADD COLUMN     "LastCalledSuccessfully" TIMESTAMP(3);
