/*
  Warnings:

  - You are about to drop the `Medicine` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Vitals` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `vitials` to the `OpdVisit` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `timing` on the `Prescription` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "Vitals" DROP CONSTRAINT "Vitals_id_fkey";

-- AlterTable
ALTER TABLE "OpdVisit" ADD COLUMN     "vitials" JSONB NOT NULL;

-- AlterTable
ALTER TABLE "Prescription" DROP COLUMN "timing",
ADD COLUMN     "timing" TEXT NOT NULL;

-- DropTable
DROP TABLE "Medicine";

-- DropTable
DROP TABLE "Vitals";

-- DropEnum
DROP TYPE "Timing";
