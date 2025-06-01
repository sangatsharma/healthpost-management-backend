/*
  Warnings:

  - You are about to drop the column `healthPostId` on the `user` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[adminId]` on the table `healthpost` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "user" DROP CONSTRAINT "user_healthPostId_fkey";

-- DropIndex
DROP INDEX "user_healthPostId_key";

-- AlterTable
ALTER TABLE "healthpost" ADD COLUMN     "adminId" TEXT;

-- AlterTable
ALTER TABLE "user" DROP COLUMN "healthPostId";

-- CreateIndex
CREATE UNIQUE INDEX "healthpost_adminId_key" ON "healthpost"("adminId");

-- AddForeignKey
ALTER TABLE "healthpost" ADD CONSTRAINT "healthpost_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
