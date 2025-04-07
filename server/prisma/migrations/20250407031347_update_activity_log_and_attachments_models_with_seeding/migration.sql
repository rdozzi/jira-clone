/*
  Warnings:

  - You are about to drop the column `ticketId` on the `Attachment` table. All the data in the column will be lost.
  - Added the required column `entityId` to the `Attachment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `entityType` to the `Attachment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fileName` to the `Attachment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fileSize` to the `Attachment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fileType` to the `Attachment` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "AttachmentEntityType" AS ENUM ('TICKET', 'COMMENT', 'USER', 'PROJECT', 'BOARD');

-- CreateEnum
CREATE TYPE "StorageType" AS ENUM ('LOCAL', 'CLOUD', 'DATABASE');

-- CreateEnum
CREATE TYPE "ActorTypeActivity" AS ENUM ('USER', 'SYSTEM');

-- DropForeignKey
ALTER TABLE "Attachment" DROP CONSTRAINT "Attachment_ticketId_fkey";

-- AlterTable
ALTER TABLE "ActivityLog" ADD COLUMN     "actorType" "ActorTypeActivity" NOT NULL DEFAULT 'USER',
ADD COLUMN     "boardId" INTEGER,
ADD COLUMN     "metadata" JSONB,
ADD COLUMN     "projectId" INTEGER,
ADD COLUMN     "ticketId" INTEGER,
ALTER COLUMN "userId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Attachment" DROP COLUMN "ticketId",
ADD COLUMN     "deletedAt" TIMESTAMPTZ,
ADD COLUMN     "entityId" INTEGER NOT NULL,
ADD COLUMN     "entityType" "AttachmentEntityType" NOT NULL,
ADD COLUMN     "fileName" VARCHAR(255) NOT NULL,
ADD COLUMN     "fileSize" INTEGER NOT NULL,
ADD COLUMN     "fileType" VARCHAR(255) NOT NULL,
ADD COLUMN     "fileUrl" VARCHAR(255),
ADD COLUMN     "storageType" "StorageType" NOT NULL DEFAULT 'LOCAL',
ALTER COLUMN "filePath" DROP NOT NULL;

-- CreateIndex
CREATE INDEX "Attachment_entityType_entityId_idx" ON "Attachment"("entityType", "entityId");

-- AddForeignKey
ALTER TABLE "ActivityLog" ADD CONSTRAINT "ActivityLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActivityLog" ADD CONSTRAINT "ActivityLog_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActivityLog" ADD CONSTRAINT "ActivityLog_boardId_fkey" FOREIGN KEY ("boardId") REFERENCES "Board"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActivityLog" ADD CONSTRAINT "ActivityLog_ticketId_fkey" FOREIGN KEY ("ticketId") REFERENCES "Ticket"("id") ON DELETE SET NULL ON UPDATE CASCADE;
