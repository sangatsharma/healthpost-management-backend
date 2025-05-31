/*
  Warnings:

  - A unique constraint covering the columns `[healthPostId]` on the table `user` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "user" ADD COLUMN     "healthPostId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "user_healthPostId_key" ON "user"("healthPostId");

-- AddForeignKey
ALTER TABLE "user" ADD CONSTRAINT "user_healthPostId_fkey" FOREIGN KEY ("healthPostId") REFERENCES "healthpost"("id") ON DELETE SET NULL ON UPDATE CASCADE;
