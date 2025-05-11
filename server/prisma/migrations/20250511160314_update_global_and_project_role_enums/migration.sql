/*
  Warnings:

  - The `role` column on the `ProjectMember` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `role` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "GlobalRole" AS ENUM ('GUEST', 'USER', 'ADMIN');

-- CreateEnum
CREATE TYPE "ProjectRole" AS ENUM ('GUEST', 'USER', 'ADMIN');

-- AlterTable
ALTER TABLE "ProjectMember" DROP COLUMN "role",
ADD COLUMN     "role" "ProjectRole" NOT NULL DEFAULT 'USER';

-- AlterTable
ALTER TABLE "User" DROP COLUMN "role",
ADD COLUMN     "role" "GlobalRole" NOT NULL DEFAULT 'USER';

-- DropEnum
DROP TYPE "Role";
