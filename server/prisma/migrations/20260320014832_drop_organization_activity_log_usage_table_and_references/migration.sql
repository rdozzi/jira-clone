/*
  Warnings:

  - You are about to drop the `OrganizationActivityLogUsage` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "OrganizationActivityLogUsage" DROP CONSTRAINT "OrganizationActivityLogUsage_organizationId_fkey";

-- DropTable
DROP TABLE "OrganizationActivityLogUsage";
