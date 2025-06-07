/*
  Warnings:

  - The `permission` column on the `user` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "RESOURCES" AS ENUM ('ALL', 'SYSTEM_CONFIG', 'DASHBOARD', 'PATIENT_RECORDS', 'PRESCRIBE_MEDICATION', 'ORDER_LAB_TESTS', 'VACCINATION_RECORD', 'MATERNAL_HEALTH_EDIT', 'LAB_RESULT_UPLOAD', 'LAB_RESULTS_VERIFY', 'COMMUNITY_REPORTS', 'HOME_VISIT_RECORD', 'INVENTORY_NEW', 'INVENTORY_MANAGE', 'MEDICINE_DISPENSE', 'USER_MANAGE', 'REPORTS_GENERATE', 'DATA_EXPORT');

-- AlterTable
ALTER TABLE "user" DROP COLUMN "permission",
ADD COLUMN     "permission" JSONB;

-- DropEnum
DROP TYPE "PERMISSIONS";
