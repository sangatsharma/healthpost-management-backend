/*
  Warnings:

  - You are about to drop the column `vitials` on the `OpdVisit` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "OpdVisit" DROP COLUMN "vitials";

-- CreateTable
CREATE TABLE "Vitals" (
    "id" TEXT NOT NULL,
    "bp" TEXT,
    "pulse" TEXT,
    "temperature" TEXT,
    "respiration" TEXT,
    "weight" TEXT,
    "height" TEXT,
    "mucus" TEXT,

    CONSTRAINT "Vitals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Medicine" (
    "id" TEXT NOT NULL,
    "label" TEXT,

    CONSTRAINT "Medicine_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Vitals_id_idx" ON "Vitals"("id");

-- AddForeignKey
ALTER TABLE "Vitals" ADD CONSTRAINT "Vitals_id_fkey" FOREIGN KEY ("id") REFERENCES "OpdVisit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
