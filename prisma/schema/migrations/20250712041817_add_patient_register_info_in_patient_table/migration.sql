/*
  Warnings:

  - You are about to drop the column `nationlId` on the `Patient` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Patient` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[patientCode]` on the table `Patient` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[email]` on the table `Patient` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `email` to the `Patient` table without a default value. This is not possible if the table is not empty.
  - Added the required column `firstName` to the `Patient` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastName` to the `Patient` table without a default value. This is not possible if the table is not empty.
  - Added the required column `role` to the `Patient` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Patient" DROP CONSTRAINT "Patient_userId_fkey";

-- DropIndex
DROP INDEX "Patient_userId_healthPostId_key";

-- AlterTable
ALTER TABLE "Patient" DROP COLUMN "nationlId",
DROP COLUMN "userId",
ADD COLUMN     "accountType" "UserType" NOT NULL DEFAULT 'PATIENT',
ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "firstName" TEXT NOT NULL,
ADD COLUMN     "gender" "GENDER",
ADD COLUMN     "height" TEXT,
ADD COLUMN     "isEligibleForSgc" BOOLEAN,
ADD COLUMN     "isMinor" BOOLEAN,
ADD COLUMN     "isVaccineCompleted" BOOLEAN,
ADD COLUMN     "lastName" TEXT NOT NULL,
ADD COLUMN     "middleName" TEXT,
ADD COLUMN     "nationalId" TEXT,
ADD COLUMN     "patientCode" TEXT,
ADD COLUMN     "profileImage" TEXT,
ADD COLUMN     "role" "ROLE" NOT NULL,
ADD COLUMN     "status" "STATUS" NOT NULL DEFAULT 'ACTIVE',
ADD COLUMN     "weight" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Patient_patientCode_key" ON "Patient"("patientCode");

-- CreateIndex
CREATE UNIQUE INDEX "Patient_email_key" ON "Patient"("email");
