/*
  Warnings:

  - You are about to drop the `_OpdVisitMedicines` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_OpdVisitMedicines" DROP CONSTRAINT "_OpdVisitMedicines_A_fkey";

-- DropForeignKey
ALTER TABLE "_OpdVisitMedicines" DROP CONSTRAINT "_OpdVisitMedicines_B_fkey";

-- AlterTable
ALTER TABLE "OpdVisit" ADD COLUMN     "medicines" TEXT[];

-- DropTable
DROP TABLE "_OpdVisitMedicines";

-- CreateIndex
CREATE INDEX "Vitals_id_idx" ON "Vitals"("id");
