/*
  Warnings:

  - You are about to drop the `OrganizationUsage` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."OrganizationUsage" DROP CONSTRAINT "OrganizationUsage_organizationId_fkey";

-- DropTable
DROP TABLE "public"."OrganizationUsage";

-- CreateTable
CREATE TABLE "public"."OrganizationProjectUsage" (
    "organizationId" INTEGER NOT NULL,
    "totalProjects" INTEGER NOT NULL DEFAULT 0,
    "maxProjects" INTEGER DEFAULT 20,
    "updatedAt" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "OrganizationProjectUsage_pkey" PRIMARY KEY ("organizationId")
);

-- CreateTable
CREATE TABLE "public"."OrganizationBoardUsage" (
    "organizationId" INTEGER NOT NULL,
    "totalBoards" INTEGER NOT NULL DEFAULT 0,
    "maxBoards" INTEGER DEFAULT 50,
    "updatedAt" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "OrganizationBoardUsage_pkey" PRIMARY KEY ("organizationId")
);

-- CreateTable
CREATE TABLE "public"."OrganizationTicketUsage" (
    "organizationId" INTEGER NOT NULL,
    "totalTickets" INTEGER NOT NULL DEFAULT 0,
    "maxTickets" INTEGER DEFAULT 5000,
    "updatedAt" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "OrganizationTicketUsage_pkey" PRIMARY KEY ("organizationId")
);

-- CreateTable
CREATE TABLE "public"."OrganizationCommentUsage" (
    "organizationId" INTEGER NOT NULL,
    "totalComments" INTEGER NOT NULL DEFAULT 0,
    "maxComments" INTEGER DEFAULT 20000,
    "updatedAt" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "OrganizationCommentUsage_pkey" PRIMARY KEY ("organizationId")
);

-- CreateTable
CREATE TABLE "public"."OrganizationUserUsage" (
    "organizationId" INTEGER NOT NULL,
    "totalUsers" INTEGER NOT NULL DEFAULT 0,
    "maxUsers" INTEGER DEFAULT 500,
    "updatedAt" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "OrganizationUserUsage_pkey" PRIMARY KEY ("organizationId")
);

-- CreateTable
CREATE TABLE "public"."OrganizationLabelUsage" (
    "organizationId" INTEGER NOT NULL,
    "totalLabels" INTEGER NOT NULL DEFAULT 0,
    "maxLabels" INTEGER DEFAULT 100,
    "updatedAt" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "OrganizationLabelUsage_pkey" PRIMARY KEY ("organizationId")
);

-- CreateTable
CREATE TABLE "public"."OrganizationActivityLogUsage" (
    "organizationId" INTEGER NOT NULL,
    "totalActivityLogs" INTEGER NOT NULL DEFAULT 0,
    "maxActivityLogs" INTEGER DEFAULT 50000,
    "updatedAt" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "OrganizationActivityLogUsage_pkey" PRIMARY KEY ("organizationId")
);

-- CreateTable
CREATE TABLE "public"."OrganizationFileStorageUsage" (
    "organizationId" INTEGER NOT NULL,
    "totalFileStorage" INTEGER NOT NULL DEFAULT 0,
    "maxFileStorage" INTEGER DEFAULT 1073741824,
    "updatedAt" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "OrganizationFileStorageUsage_pkey" PRIMARY KEY ("organizationId")
);

-- CreateTable
CREATE TABLE "public"."OrganizationBannedEmailsUsage" (
    "organizationId" INTEGER NOT NULL,
    "totalBannedEmails" INTEGER NOT NULL DEFAULT 0,
    "maxBannedEmails" INTEGER DEFAULT 100,
    "updatedAt" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "OrganizationBannedEmailsUsage_pkey" PRIMARY KEY ("organizationId")
);

-- AddForeignKey
ALTER TABLE "public"."OrganizationProjectUsage" ADD CONSTRAINT "OrganizationProjectUsage_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "public"."Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."OrganizationBoardUsage" ADD CONSTRAINT "OrganizationBoardUsage_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "public"."Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."OrganizationTicketUsage" ADD CONSTRAINT "OrganizationTicketUsage_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "public"."Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."OrganizationCommentUsage" ADD CONSTRAINT "OrganizationCommentUsage_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "public"."Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."OrganizationUserUsage" ADD CONSTRAINT "OrganizationUserUsage_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "public"."Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."OrganizationLabelUsage" ADD CONSTRAINT "OrganizationLabelUsage_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "public"."Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."OrganizationActivityLogUsage" ADD CONSTRAINT "OrganizationActivityLogUsage_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "public"."Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."OrganizationFileStorageUsage" ADD CONSTRAINT "OrganizationFileStorageUsage_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "public"."Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."OrganizationBannedEmailsUsage" ADD CONSTRAINT "OrganizationBannedEmailsUsage_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "public"."Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
