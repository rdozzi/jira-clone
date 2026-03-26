/*
  Warnings:

  - Made the column `isDeleted` on table `Organization` required. This step will fail if there are existing NULL values in that column.
  - Made the column `slug` on table `Organization` required. This step will fail if there are existing NULL values in that column.
  - Made the column `mustChangePassword` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `isEmailVerified` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Organization" ALTER COLUMN "isDeleted" SET NOT NULL,
ALTER COLUMN "slug" SET NOT NULL;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "mustChangePassword" SET NOT NULL,
ALTER COLUMN "mustChangePassword" SET DEFAULT true,
ALTER COLUMN "isEmailVerified" SET NOT NULL,
ALTER COLUMN "isEmailVerified" SET DEFAULT false;
