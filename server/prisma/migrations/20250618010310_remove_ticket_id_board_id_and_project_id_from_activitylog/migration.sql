/*
  Warnings:

  - You are about to drop the column `boardId` on the `ActivityLog` table. All the data in the column will be lost.
  - You are about to drop the column `projectId` on the `ActivityLog` table. All the data in the column will be lost.
  - You are about to drop the column `ticketId` on the `ActivityLog` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ActivityLog" DROP COLUMN "boardId",
DROP COLUMN "projectId",
DROP COLUMN "ticketId";
