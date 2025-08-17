import { PrismaClient, Prisma } from '@prisma/client';
import { createOrgProjectCount } from './createOrgProjectCount';
import { createOrgBoardCount } from './createOrgBoardCount';
import { createOrgTicketCount } from './createOrgTicketCount';
import { createOrgCommentCount } from './createOrgCommentCount';
import { createOrgUserCount } from './createOrgUserCount';
import { createOrgFileStorageCount } from './createOrgFileStorageCount';
import { createOrgLabelCount } from './createOrgLabelCount';
import { createOrgActivityLogCount } from './createOrgActivityLogCount';
import { createOrgBannedEmailCount } from './createOrgBannedEmailCount';

export async function createOrgCountRecords(
  prismaTest: PrismaClient | Prisma.TransactionClient,
  organizationId: number
): Promise<void> {
  await createOrgProjectCount(prismaTest, organizationId);
  await createOrgBoardCount(prismaTest, organizationId);
  await createOrgTicketCount(prismaTest, organizationId);
  await createOrgCommentCount(prismaTest, organizationId);
  await createOrgUserCount(prismaTest, organizationId);
  await createOrgLabelCount(prismaTest, organizationId);
  await createOrgFileStorageCount(prismaTest, organizationId);
  await createOrgActivityLogCount(prismaTest, organizationId);
  await createOrgBannedEmailCount(prismaTest, organizationId);
  return;
}
