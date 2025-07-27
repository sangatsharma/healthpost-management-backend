/*
  Warnings:

  - You are about to drop the `OpdReferal` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "OpdStatusType" AS ENUM ('PENDING', 'INPROGRESS', 'COMPLETED');

-- DropTable
DROP TABLE "OpdReferal";

-- CreateTable
CREATE TABLE "OpdReferral" (
    "id" TEXT NOT NULL,
    "staffId" TEXT NOT NULL,
    "healthPostId" TEXT NOT NULL,
    "referredHealthPostId" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "opdId" TEXT NOT NULL,
    "referralStatus" "OpdStatusType" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OpdReferral_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "OpdReferral_opdId_key" ON "OpdReferral"("opdId");

-- AddForeignKey
ALTER TABLE "OpdReferral" ADD CONSTRAINT "OpdReferral_staffId_fkey" FOREIGN KEY ("staffId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OpdReferral" ADD CONSTRAINT "OpdReferral_healthPostId_fkey" FOREIGN KEY ("healthPostId") REFERENCES "healthpost"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OpdReferral" ADD CONSTRAINT "OpdReferral_referredHealthPostId_fkey" FOREIGN KEY ("referredHealthPostId") REFERENCES "healthpost"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OpdReferral" ADD CONSTRAINT "OpdReferral_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OpdReferral" ADD CONSTRAINT "OpdReferral_opdId_fkey" FOREIGN KEY ("opdId") REFERENCES "OpdVisit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
