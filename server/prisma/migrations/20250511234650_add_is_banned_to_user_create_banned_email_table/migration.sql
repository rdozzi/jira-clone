-- AlterTable
ALTER TABLE "User" ADD COLUMN     "isBanned" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "BannedEmail" (
    "id" SERIAL NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "reason" VARCHAR(255) NOT NULL,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BannedEmail_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BannedEmail_email_key" ON "BannedEmail"("email");
