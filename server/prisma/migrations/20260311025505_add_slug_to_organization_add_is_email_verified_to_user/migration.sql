-- DropIndex
DROP INDEX "Organization_name_key";

-- AlterTable
ALTER TABLE "Organization" ADD COLUMN     "slug" VARCHAR(150);

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "isEmailVerified" BOOLEAN DEFAULT true;
