/*
  Warnings:

  - A unique constraint covering the columns `[userId,healthPostId]` on the table `Patient` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `healthPostId` to the `Patient` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Patient_userId_key";

-- AlterTable
ALTER TABLE "Patient" ADD COLUMN     "healthPostId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Patient_userId_healthPostId_key" ON "Patient"("userId", "healthPostId");

-- AddForeignKey
ALTER TABLE "Patient" ADD CONSTRAINT "Patient_healthPostId_fkey" FOREIGN KEY ("healthPostId") REFERENCES "healthpost"("id") ON DELETE CASCADE ON UPDATE CASCADE;
