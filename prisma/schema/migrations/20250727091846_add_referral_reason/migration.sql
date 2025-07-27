-- AlterTable
ALTER TABLE "OpdReferral" ADD COLUMN     "referralReason" TEXT;

-- CreateTable
CREATE TABLE "Notice" (
    "id" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Notice_pkey" PRIMARY KEY ("id")
);
