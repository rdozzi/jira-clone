-- CreateTable
CREATE TABLE "OrganizationUsage" (
    "organizationId" INTEGER NOT NULL,
    "totalProjects" INTEGER NOT NULL DEFAULT 0,
    "totalBoards" INTEGER NOT NULL DEFAULT 0,
    "totalTickets" INTEGER NOT NULL DEFAULT 0,
    "totalComments" INTEGER NOT NULL DEFAULT 0,
    "totalUsers" INTEGER NOT NULL DEFAULT 0,
    "totalAttachments" INTEGER NOT NULL DEFAULT 0,
    "totalLabels" INTEGER NOT NULL DEFAULT 0,
    "totalActivityLogs" INTEGER NOT NULL DEFAULT 0,
    "totalFileStorage" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "OrganizationUsage_pkey" PRIMARY KEY ("organizationId")
);

-- AddForeignKey
ALTER TABLE "OrganizationUsage" ADD CONSTRAINT "OrganizationUsage_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
