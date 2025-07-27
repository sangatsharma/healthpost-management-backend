/*
  Warnings:

  - You are about to drop the column `message` on the `Notice` table. All the data in the column will be lost.
  - Added the required column `description` to the `Notice` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `Notice` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "NoticeType" AS ENUM ('HP', 'PATIENT', 'ALL');

-- AlterTable
ALTER TABLE "Notice" DROP COLUMN "message",
ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "toIds" TEXT[],
ADD COLUMN     "type" "NoticeType" NOT NULL;
