/*
  Warnings:

  - Added the required column `count` to the `AssetEngagement` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
ALTER TYPE "OpdStatusType" ADD VALUE 'COMPLETED';

-- AlterTable
ALTER TABLE "AssetEngagement" ADD COLUMN     "count" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "OpdReferral" ADD COLUMN     "referralNo" SERIAL NOT NULL;
