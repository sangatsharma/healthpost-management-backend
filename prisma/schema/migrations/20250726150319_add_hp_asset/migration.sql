/*
  Warnings:

  - You are about to drop the `healthpostassets` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "healthpostassets" DROP CONSTRAINT "healthpostassets_id_fkey";

-- DropTable
DROP TABLE "healthpostassets";

-- CreateTable
CREATE TABLE "HealthPostAssetType" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "HealthPostAssetType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HealthPostAsset" (
    "id" TEXT NOT NULL,
    "healthPostId" TEXT NOT NULL,
    "assetTypeId" TEXT NOT NULL,
    "totalCount" INTEGER NOT NULL DEFAULT 0,
    "engagedCount" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "HealthPostAsset_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AssetEngagement" (
    "id" TEXT NOT NULL,
    "assetId" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "opdVisitId" TEXT,
    "engagedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "releasedAt" TIMESTAMP(3),

    CONSTRAINT "AssetEngagement_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "HealthPostAsset_healthPostId_assetTypeId_key" ON "HealthPostAsset"("healthPostId", "assetTypeId");

-- AddForeignKey
ALTER TABLE "HealthPostAsset" ADD CONSTRAINT "HealthPostAsset_healthPostId_fkey" FOREIGN KEY ("healthPostId") REFERENCES "healthpost"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HealthPostAsset" ADD CONSTRAINT "HealthPostAsset_assetTypeId_fkey" FOREIGN KEY ("assetTypeId") REFERENCES "HealthPostAssetType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssetEngagement" ADD CONSTRAINT "AssetEngagement_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "HealthPostAsset"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssetEngagement" ADD CONSTRAINT "AssetEngagement_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssetEngagement" ADD CONSTRAINT "AssetEngagement_opdVisitId_fkey" FOREIGN KEY ("opdVisitId") REFERENCES "OpdVisit"("id") ON DELETE SET NULL ON UPDATE CASCADE;
