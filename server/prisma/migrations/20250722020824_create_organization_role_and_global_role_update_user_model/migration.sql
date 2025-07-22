/*
  Warnings:

  - The values [GUEST,ADMIN,SUPERADMIN] on the enum `GlobalRole` will be removed. If these variants are still used in the database, this will fail.

*/
-- CreateEnum
CREATE TYPE "OrganizationRole" AS ENUM ('GUEST', 'USER', 'ADMIN', 'SUPERADMIN');

-- AlterEnum
BEGIN;
CREATE TYPE "GlobalRole_new" AS ENUM ('SUPERUSER', 'USER');
ALTER TABLE "User" ALTER COLUMN "globalRole" DROP DEFAULT;
ALTER TABLE "User" ALTER COLUMN "globalRole" TYPE "GlobalRole_new" USING ("globalRole"::text::"GlobalRole_new");
ALTER TYPE "GlobalRole" RENAME TO "GlobalRole_old";
ALTER TYPE "GlobalRole_new" RENAME TO "GlobalRole";
DROP TYPE "GlobalRole_old";
ALTER TABLE "User" ALTER COLUMN "globalRole" SET DEFAULT 'USER';
COMMIT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "organizationRole" "OrganizationRole" NOT NULL DEFAULT 'USER';
