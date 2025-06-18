/*
  Warnings:

  - You are about to drop the column `number` on the `healthpost` table. All the data in the column will be lost.
  - Added the required column `phone` to the `healthpost` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `healthpost` table without a default value. This is not possible if the table is not empty.
  - Added the required column `wardNo` to the `healthpost` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "HealthPostStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- AlterTable
ALTER TABLE "healthpost" DROP COLUMN "number",
ADD COLUMN     "email" TEXT,
ADD COLUMN     "municipality" TEXT,
ADD COLUMN     "phone" TEXT NOT NULL,
ADD COLUMN     "status" "HealthPostStatus" NOT NULL,
ADD COLUMN     "wardNo" INTEGER NOT NULL,
ALTER COLUMN "name" DROP NOT NULL,
ALTER COLUMN "location" DROP NOT NULL;
