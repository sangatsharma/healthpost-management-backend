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

-- AddForeignKey
ALTER TABLE "healthpostassets" ADD CONSTRAINT "healthpostassets_id_fkey" FOREIGN KEY ("id") REFERENCES "healthpost"("id") ON DELETE CASCADE ON UPDATE CASCADE;
