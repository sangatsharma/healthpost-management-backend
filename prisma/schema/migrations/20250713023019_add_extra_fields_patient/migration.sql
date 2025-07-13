-- AlterTable
ALTER TABLE "Patient" ADD COLUMN     "optCreatedAt" TIMESTAMP(3),
ADD COLUMN     "otp" TEXT,
ADD COLUMN     "refreshToken" TEXT;
