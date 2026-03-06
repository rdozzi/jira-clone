/*
  Warnings:

  - The values [VERIFY_EMAIL,INITIAL_PASSWORD_SETUP] on the enum `TokenPurpose` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "TokenPurpose_new" AS ENUM ('RESET_PASSWORD', 'ACCOUNT_ACTIVATION', 'ACCOUNT_INVITE');
ALTER TABLE "PasswordToken" ALTER COLUMN "purpose" TYPE "TokenPurpose_new" USING ("purpose"::text::"TokenPurpose_new");
ALTER TYPE "TokenPurpose" RENAME TO "TokenPurpose_old";
ALTER TYPE "TokenPurpose_new" RENAME TO "TokenPurpose";
DROP TYPE "public"."TokenPurpose_old";
COMMIT;
