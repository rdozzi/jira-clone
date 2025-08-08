/*
  Warnings:

  - You are about to drop the column `totalAttachments` on the `OrganizationUsage` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "OrganizationUsage" DROP COLUMN "totalAttachments",
ADD COLUMN     "totalBannedEmails" INTEGER NOT NULL DEFAULT 0;
