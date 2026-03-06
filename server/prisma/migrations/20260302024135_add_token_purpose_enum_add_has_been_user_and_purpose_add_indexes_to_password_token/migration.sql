/*
  Warnings:

  - You are about to drop the column `used` on the `PasswordToken` table. All the data in the column will be lost.
  - Added the required column `purpose` to the `PasswordToken` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "TokenPurpose" AS ENUM ('RESET_PASSWORD', 'VERIFY_EMAIL');

-- AlterTable
ALTER TABLE "PasswordToken" DROP COLUMN "used",
ADD COLUMN     "hasBeenUsed" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "purpose" "TokenPurpose" NOT NULL;

-- CreateIndex
CREATE INDEX "PasswordToken_userId_idx" ON "PasswordToken"("userId");

-- CreateIndex
CREATE INDEX "PasswordToken_purpose_idx" ON "PasswordToken"("purpose");
