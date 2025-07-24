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
