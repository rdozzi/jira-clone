/*
  Warnings:

  - You are about to alter the column `action` on the `ActivityLog` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(50)`.
  - You are about to alter the column `targetType` on the `ActivityLog` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(50)`.
  - You are about to alter the column `name` on the `Board` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(100)`.
  - You are about to alter the column `name` on the `Label` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(25)`.
  - You are about to alter the column `color` on the `Label` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(9)`.
  - You are about to alter the column `name` on the `Organization` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(150)`.
  - You are about to alter the column `name` on the `Project` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(100)`.
  - You are about to alter the column `title` on the `Ticket` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(150)`.
  - You are about to alter the column `firstName` on the `User` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(150)`.
  - You are about to alter the column `lastName` on the `User` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(150)`.
  - A unique constraint covering the columns `[name]` on the table `Organization` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "ActivityLog" ALTER COLUMN "action" SET DATA TYPE VARCHAR(50),
ALTER COLUMN "targetType" SET DATA TYPE VARCHAR(50);

-- AlterTable
ALTER TABLE "Attachment" ALTER COLUMN "fileName" SET DATA TYPE VARCHAR(2048),
ALTER COLUMN "fileType" SET DATA TYPE VARCHAR(2048),
ALTER COLUMN "fileUrl" SET DATA TYPE VARCHAR(2048);

-- AlterTable
ALTER TABLE "BannedEmail" ALTER COLUMN "reason" SET DATA TYPE VARCHAR(2000);

-- AlterTable
ALTER TABLE "Board" ALTER COLUMN "name" SET DATA TYPE VARCHAR(100),
ALTER COLUMN "description" SET DATA TYPE VARCHAR(500);

-- AlterTable
ALTER TABLE "Label" ALTER COLUMN "name" SET DATA TYPE VARCHAR(25),
ALTER COLUMN "color" SET DATA TYPE VARCHAR(9);

-- AlterTable
ALTER TABLE "Organization" ALTER COLUMN "name" SET DATA TYPE VARCHAR(150);

-- AlterTable
ALTER TABLE "Project" ALTER COLUMN "name" SET DATA TYPE VARCHAR(100),
ALTER COLUMN "description" SET DATA TYPE VARCHAR(500);

-- AlterTable
ALTER TABLE "Ticket" ALTER COLUMN "title" SET DATA TYPE VARCHAR(150),
ALTER COLUMN "description" SET DATA TYPE VARCHAR(3000);

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "firstName" SET DATA TYPE VARCHAR(150),
ALTER COLUMN "lastName" SET DATA TYPE VARCHAR(150),
ALTER COLUMN "avatarSource" SET DATA TYPE VARCHAR(2048);

-- CreateIndex
CREATE UNIQUE INDEX "Organization_name_key" ON "Organization"("name");
