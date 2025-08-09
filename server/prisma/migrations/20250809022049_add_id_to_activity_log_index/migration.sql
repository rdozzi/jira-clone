-- DropIndex
DROP INDEX "public"."ActivityLog_organizationId_createdAt_idx";

-- CreateIndex
CREATE INDEX "ActivityLog_organizationId_createdAt_id_idx" ON "public"."ActivityLog"("organizationId", "createdAt" ASC, "id");
