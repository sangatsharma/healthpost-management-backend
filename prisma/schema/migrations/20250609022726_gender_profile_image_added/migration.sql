-- CreateEnum
CREATE TYPE "GENDER" AS ENUM ('MALE', 'FEMALE', 'OTHER');

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "gender" "GENDER",
ADD COLUMN     "healthPostId" TEXT,
ADD COLUMN     "phoneNumber" TEXT,
ADD COLUMN     "profileImage" TEXT;
