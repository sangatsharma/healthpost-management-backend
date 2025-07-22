-- CreateEnum
CREATE TYPE "VisitType" AS ENUM ('CONSULTATION', 'FOLLOW_UP', 'EMERGENCY', 'ROUTINE_CHECKUP', 'TELEMEDICINE', 'HOME_VISIT', 'GENERAL', 'OTHER');

-- CreateEnum
CREATE TYPE "TreatementType" AS ENUM ('MEDICATION', 'SURGERY', 'THERAPY', 'DIAGNOSTIC_TEST', 'REHABILITATION', 'PALLIATIVE_CARE', 'OTHER');

-- CreateEnum
CREATE TYPE "Timing" AS ENUM ('beforeMeal', 'afterMeal', 'anytime');

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
    "timing" "Timing" NOT NULL,
    "dosage" TEXT NOT NULL,

    CONSTRAINT "Prescription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Medicine" (
    "id" TEXT NOT NULL,
    "label" TEXT,

    CONSTRAINT "Medicine_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_OpdVisitMedicines" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_OpdVisitMedicines_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_OpdVisitMedicines_B_index" ON "_OpdVisitMedicines"("B");

-- AddForeignKey
ALTER TABLE "OpdVisit" ADD CONSTRAINT "OpdVisit_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OpdVisit" ADD CONSTRAINT "OpdVisit_examinerId_fkey" FOREIGN KEY ("examinerId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OpdVisit" ADD CONSTRAINT "OpdVisit_healthPostId_fkey" FOREIGN KEY ("healthPostId") REFERENCES "healthpost"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vitals" ADD CONSTRAINT "Vitals_id_fkey" FOREIGN KEY ("id") REFERENCES "OpdVisit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Prescription" ADD CONSTRAINT "Prescription_opdVisitId_fkey" FOREIGN KEY ("opdVisitId") REFERENCES "OpdVisit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_OpdVisitMedicines" ADD CONSTRAINT "_OpdVisitMedicines_A_fkey" FOREIGN KEY ("A") REFERENCES "Medicine"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_OpdVisitMedicines" ADD CONSTRAINT "_OpdVisitMedicines_B_fkey" FOREIGN KEY ("B") REFERENCES "OpdVisit"("id") ON DELETE CASCADE ON UPDATE CASCADE;
