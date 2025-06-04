-- CreateTable
CREATE TABLE "HpUserProfile" (
    "userId" TEXT NOT NULL,
    "role" "ROLE" NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "HpUserProfile_userId_key" ON "HpUserProfile"("userId");
