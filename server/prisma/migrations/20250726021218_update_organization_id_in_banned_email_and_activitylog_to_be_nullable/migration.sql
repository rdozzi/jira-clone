-- DropForeignKey
ALTER TABLE "ActivityLog" DROP CONSTRAINT "ActivityLog_organizationId_fkey";

-- DropForeignKey
ALTER TABLE "BannedEmail" DROP CONSTRAINT "BannedEmail_organizationId_fkey";

-- AlterTable
ALTER TABLE "ActivityLog" ALTER COLUMN "organizationId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "BannedEmail" ALTER COLUMN "organizationId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "ActivityLog" ADD CONSTRAINT "ActivityLog_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BannedEmail" ADD CONSTRAINT "BannedEmail_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE SET NULL ON UPDATE CASCADE;
