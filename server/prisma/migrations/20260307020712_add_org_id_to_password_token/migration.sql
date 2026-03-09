/*
  Warnings:

  - Added the required column `organizationId` to the `PasswordToken` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PasswordToken" ADD COLUMN     "organizationId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "PasswordToken" ADD CONSTRAINT "PasswordToken_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
