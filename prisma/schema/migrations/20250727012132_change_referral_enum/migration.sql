/*
  Warnings:

  - The values [INPROGRESS,COMPLETED] on the enum `OpdStatusType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "OpdStatusType_new" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');
ALTER TABLE "OpdReferral" ALTER COLUMN "referralStatus" DROP DEFAULT;
ALTER TABLE "OpdReferral" ALTER COLUMN "referralStatus" TYPE "OpdStatusType_new" USING ("referralStatus"::text::"OpdStatusType_new");
ALTER TYPE "OpdStatusType" RENAME TO "OpdStatusType_old";
ALTER TYPE "OpdStatusType_new" RENAME TO "OpdStatusType";
DROP TYPE "OpdStatusType_old";
ALTER TABLE "OpdReferral" ALTER COLUMN "referralStatus" SET DEFAULT 'PENDING';
COMMIT;
