-- CreateEnum
CREATE TYPE "HealthPostStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateEnum
CREATE TYPE "VisitType" AS ENUM ('CONSULTATION', 'FOLLOW_UP', 'EMERGENCY', 'ROUTINE_CHECKUP', 'TELEMEDICINE', 'HOME_VISIT', 'GENERAL', 'OTHER');

-- CreateEnum
CREATE TYPE "TreatementType" AS ENUM ('MEDICATION', 'SURGERY', 'THERAPY', 'DIAGNOSTIC_TEST', 'REHABILITATION', 'PALLIATIVE_CARE', 'OTHER');

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

-- CreateEnum
CREATE TYPE "ROLE" AS ENUM ('SUPERADMIN', 'ADMIN', 'PATIENT', 'HEALTH_ASSISTANT', 'ANM', 'LAB_TECHNICIAN', 'FCHV', 'INVENTORY_KEEPER', 'OFFICE_HELPER', 'ALL');

-- CreateEnum
CREATE TYPE "UserType" AS ENUM ('PATIENT', 'HP', 'ADMIN');

-- CreateEnum
CREATE TYPE "RESOURCES" AS ENUM ('ALL', 'SYSTEM_CONFIG', 'DASHBOARD', 'PATIENT_RECORDS', 'PRESCRIBE_MEDICATION', 'ORDER_LAB_TESTS', 'VACCINATION_RECORD', 'MATERNAL_HEALTH_EDIT', 'LAB_RESULT_UPLOAD', 'LAB_RESULTS_VERIFY', 'COMMUNITY_REPORTS', 'HOME_VISIT_RECORD', 'INVENTORY_NEW', 'INVENTORY_MANAGE', 'MEDICINE_DISPENSE', 'USER_MANAGE', 'REPORTS_GENERATE', 'DATA_EXPORT');

-- CreateEnum
CREATE TYPE "ACTION" AS ENUM ('READ', 'WRITE');

-- CreateEnum
CREATE TYPE "GENDER" AS ENUM ('MALE', 'FEMALE', 'OTHER');

-- CreateEnum
CREATE TYPE "STATUS" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateTable
CREATE TABLE "healthpost" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "location" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "adminId" TEXT,
    "email" TEXT,
    "municipality" TEXT,
    "phone" TEXT NOT NULL,
    "status" "HealthPostStatus" NOT NULL,
    "wardNo" INTEGER NOT NULL,
    "images" TEXT[] DEFAULT ARRAY[]::TEXT[],

    CONSTRAINT "healthpost_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "healthpostconfig" (
    "id" TEXT NOT NULL,
    "isOpen" BOOLEAN,

    CONSTRAINT "healthpostconfig_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "healthpostassets" (
    "id" TEXT NOT NULL,
    "ambulanceCount" INTEGER NOT NULL DEFAULT 0,
    "ambulanceEngaged" INTEGER NOT NULL DEFAULT 0,
    "oxygenCylinderCount" INTEGER NOT NULL DEFAULT 0,
    "oxygenCylinderEngaged" INTEGER NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "healthpostassets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OpdVisit" (
    "id" TEXT NOT NULL,
    "visitedDate" TIMESTAMP(3) NOT NULL,
    "patientId" TEXT NOT NULL,
    "examinerId" TEXT NOT NULL,
    "healthPostId" TEXT NOT NULL,
    "complaints" TEXT NOT NULL,
    "diagnosis" TEXT NOT NULL,
    "observedExamination" TEXT NOT NULL,
    "treatment" TEXT NOT NULL,
    "followUpRequired" BOOLEAN,
    "followUpDate" TIMESTAMP(3),
    "isGenderViolence" BOOLEAN,
    "isPregenant" BOOLEAN,
    "treatementType" "TreatementType" NOT NULL,
    "visitType" "VisitType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "medicines" TEXT[],
    "opdNo" SERIAL NOT NULL,

    CONSTRAINT "OpdVisit_pkey" PRIMARY KEY ("id")
);

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
CREATE TABLE "Prescription" (
    "id" TEXT NOT NULL,
    "opdVisitId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "duration" TEXT NOT NULL,
    "frequency" TEXT NOT NULL,
    "intakeTime" TEXT NOT NULL,
    "quantity" TEXT NOT NULL,
    "intakeRoute" TEXT NOT NULL,
    "dosage" TEXT NOT NULL,
    "timing" TEXT NOT NULL,

    CONSTRAINT "Prescription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Medicine" (
    "id" TEXT NOT NULL,
    "label" TEXT,

    CONSTRAINT "Medicine_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OpdReferal" (
    "id" TEXT NOT NULL,
    "staffId" TEXT NOT NULL,
    "healthPostId" TEXT NOT NULL,
    "referedHealthPostId" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OpdReferal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Patient" (
    "id" TEXT NOT NULL,
    "dobBs" TEXT NOT NULL,
    "dobAd" TEXT,
    "casteType" "CasteType" NOT NULL,
    "citizenshipNumber" TEXT,
    "nationality" "Nationality" NOT NULL,
    "emergencyContact" TEXT NOT NULL,
    "districtId" TEXT NOT NULL,
    "palityId" TEXT NOT NULL,
    "wardNo" INTEGER NOT NULL,
    "tole" TEXT NOT NULL,
    "tDistrictId" TEXT,
    "tPalityId" TEXT,
    "tWardNo" INTEGER,
    "tTole" TEXT,
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
    "healthPostId" TEXT NOT NULL,
    "accountType" "UserType" NOT NULL DEFAULT 'PATIENT',
    "email" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "gender" "GENDER",
    "height" TEXT,
    "isEligibleForSgc" BOOLEAN,
    "isMinor" BOOLEAN,
    "isVaccineCompleted" BOOLEAN,
    "lastName" TEXT NOT NULL,
    "middleName" TEXT,
    "nationalId" TEXT,
    "patientCode" TEXT,
    "profileImage" TEXT,
    "role" "ROLE" NOT NULL,
    "status" "STATUS" NOT NULL DEFAULT 'ACTIVE',
    "weight" TEXT,
    "count" SERIAL NOT NULL,
    "optCreatedAt" TIMESTAMP(3),
    "familyHistory" TEXT,
    "otp" TEXT,
    "refreshToken" TEXT,
    "disabilityType" "DisabilityType",
    "phone" TEXT,
    "phoneNumber" TEXT,
    "maritalStatus" "MarriageStatus",

    CONSTRAINT "Patient_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "role" "ROLE" NOT NULL,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "refreshToken" TEXT,
    "optCreatedAt" TIMESTAMP(3),
    "otp" TEXT,
    "accountType" "UserType" NOT NULL,
    "permission" JSONB NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "middleName" TEXT,
    "gender" "GENDER",
    "healthPostId" TEXT,
    "phoneNumber" TEXT,
    "profileImage" TEXT,
    "status" "STATUS" NOT NULL DEFAULT 'ACTIVE',
    "signature" TEXT,
    "profileImagePublicId" TEXT,
    "signaturePublicId" TEXT,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HpUserProfile" (
    "userId" TEXT NOT NULL,
    "role" "ROLE" NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "healthpost_adminId_key" ON "healthpost"("adminId");

-- CreateIndex
CREATE INDEX "Vitals_id_idx" ON "Vitals"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Patient_email_key" ON "Patient"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Patient_patientCode_key" ON "Patient"("patientCode");

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "HpUserProfile_userId_key" ON "HpUserProfile"("userId");

-- AddForeignKey
ALTER TABLE "healthpost" ADD CONSTRAINT "healthpost_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "healthpostconfig" ADD CONSTRAINT "healthpostconfig_id_fkey" FOREIGN KEY ("id") REFERENCES "healthpost"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "healthpostassets" ADD CONSTRAINT "healthpostassets_id_fkey" FOREIGN KEY ("id") REFERENCES "healthpost"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OpdVisit" ADD CONSTRAINT "OpdVisit_examinerId_fkey" FOREIGN KEY ("examinerId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OpdVisit" ADD CONSTRAINT "OpdVisit_healthPostId_fkey" FOREIGN KEY ("healthPostId") REFERENCES "healthpost"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OpdVisit" ADD CONSTRAINT "OpdVisit_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vitals" ADD CONSTRAINT "Vitals_id_fkey" FOREIGN KEY ("id") REFERENCES "OpdVisit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Prescription" ADD CONSTRAINT "Prescription_opdVisitId_fkey" FOREIGN KEY ("opdVisitId") REFERENCES "OpdVisit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Patient" ADD CONSTRAINT "Patient_healthPostId_fkey" FOREIGN KEY ("healthPostId") REFERENCES "healthpost"("id") ON DELETE CASCADE ON UPDATE CASCADE;
