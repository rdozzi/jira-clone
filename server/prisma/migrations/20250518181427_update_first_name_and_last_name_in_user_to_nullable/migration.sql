-- AlterTable
ALTER TABLE "BannedEmail" ALTER COLUMN "createdAt" DROP NOT NULL;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "firstName" DROP NOT NULL,
ALTER COLUMN "lastName" DROP NOT NULL;
