/*
  Warnings:

  - The values [DATABASE] on the enum `StorageType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "StorageType_new" AS ENUM ('LOCAL', 'CLOUD');
ALTER TABLE "Attachment" ALTER COLUMN "storageType" DROP DEFAULT;
ALTER TABLE "Attachment" ALTER COLUMN "storageType" TYPE "StorageType_new" USING ("storageType"::text::"StorageType_new");
ALTER TYPE "StorageType" RENAME TO "StorageType_old";
ALTER TYPE "StorageType_new" RENAME TO "StorageType";
DROP TYPE "StorageType_old";
ALTER TABLE "Attachment" ALTER COLUMN "storageType" SET DEFAULT 'LOCAL';
COMMIT;
