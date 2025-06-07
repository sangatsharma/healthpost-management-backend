/*
  Warnings:

  - Made the column `accountType` on table `user` required. This step will fail if there are existing NULL values in that column.
  - Made the column `permission` on table `user` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "user" ALTER COLUMN "accountType" SET NOT NULL,
ALTER COLUMN "permission" SET NOT NULL;
