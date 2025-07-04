-- CreateEnum
CREATE TYPE "CasteType" AS ENUM ('BRAMAN_CHHETRI', 'DALIT', 'JANAJATI', 'MUSLIM', 'MADESHI', 'OTHERS');

-- CreateEnum
CREATE TYPE "Nationality" AS ENUM ('NEPALI', 'INDIAN', 'OTHER');

-- CreateEnum
CREATE TYPE "MarriageStatus" AS ENUM ('MARRIED', 'UNMARRIED', 'DIVORCED', 'WIDOWED', 'SEPARATED', 'OTHER');

-- CreateEnum
CREATE TYPE "BloodGroup" AS ENUM ('A_POSITIVE', 'A_NEGATIVE', 'B_POSITIVE', 'B_NEGATIVE', 'AB_POSITIVE', 'AB_NEGATIVE', 'O_POSITIVE', 'O_NEGATIVE');

-- CreateEnum
CREATE TYPE "DisabilityType" AS ENUM ('PHYSICAL', 'VISUAL', 'HEARING', 'INTELLECTUAL', 'MENTAL', 'MULTIPLE', 'OTHER');

-- CreateEnum
CREATE TYPE "DisabilityIdentityType" AS ENUM ('NATIONAL_CARD', 'PROVINCIAL_CARD', 'LOCAL_CARD', 'HOSPITAL_CERTIFICATE', 'OTHER');

-- CreateTable
CREATE TABLE "Patient" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "dobBs" TEXT NOT NULL,
    "dobAd" TEXT,
    "casteType" "CasteType" NOT NULL,
    "citizenshipNumber" TEXT,
    "nationlId" TEXT,
    "nationality" "Nationality" NOT NULL,
    "emergencyContact" TEXT NOT NULL,
    "districtId" TEXT NOT NULL,
    "palityId" TEXT NOT NULL,
    "wardNo" INTEGER NOT NULL,
    "tole" TEXT NOT NULL,
    "tDistrictId" TEXT,
    "tPalityId" TEXT NOT NULL,
    "tWardNo" INTEGER NOT NULL,
    "tTole" TEXT NOT NULL,
    "fatherName" TEXT NOT NULL,
    "motherName" TEXT NOT NULL,
    "guardianName" TEXT,
    "spouseName" TEXT,
    "lockReport" BOOLEAN NOT NULL,
    "bloodGroup" "BloodGroup" NOT NULL,
    "disabilityIdentityType" "DisabilityIdentityType",
    "nshiNumber" TEXT NOT NULL,
    "bank" TEXT,
    "bankBranch" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Patient_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Patient_userId_key" ON "Patient"("userId");

-- AddForeignKey
ALTER TABLE "Patient" ADD CONSTRAINT "Patient_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
