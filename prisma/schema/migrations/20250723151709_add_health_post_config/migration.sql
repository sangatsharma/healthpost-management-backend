-- CreateTable
CREATE TABLE "healthpostconfig" (
    "id" TEXT NOT NULL,
    "isOpen" BOOLEAN,

    CONSTRAINT "healthpostconfig_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "healthpostconfig" ADD CONSTRAINT "healthpostconfig_id_fkey" FOREIGN KEY ("id") REFERENCES "healthpost"("id") ON DELETE CASCADE ON UPDATE CASCADE;
