/*
  Warnings:

  - You are about to drop the column `name` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User"
ADD COLUMN     "first_name" VARCHAR(255),
ADD COLUMN     "last_name" VARCHAR(255);

