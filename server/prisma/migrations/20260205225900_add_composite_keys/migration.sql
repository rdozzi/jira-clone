/*
  Warnings:

  - A unique constraint covering the columns `[name,organizationId]` on the table `Board` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name,organizationId]` on the table `Project` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[title,organizationId]` on the table `Ticket` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Board_name_organizationId_key" ON "Board"("name", "organizationId");

-- CreateIndex
CREATE UNIQUE INDEX "Project_name_organizationId_key" ON "Project"("name", "organizationId");

-- CreateIndex
CREATE UNIQUE INDEX "Ticket_title_organizationId_key" ON "Ticket"("title", "organizationId");
