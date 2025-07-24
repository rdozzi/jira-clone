-- AlterTable
ALTER TABLE "Organization" ADD COLUMN     "deletedAt" TIMESTAMPTZ,
ADD COLUMN     "isDeleted" BOOLEAN DEFAULT false,
ALTER COLUMN "updatedAt" DROP DEFAULT;
