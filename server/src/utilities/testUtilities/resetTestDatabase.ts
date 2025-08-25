import { prismaTest } from '../../lib/prismaTestClient';
import dotenv from 'dotenv';

dotenv.config();

export async function resetTestDatabase() {
  if (!process.env.DATABASE_URL?.includes('test')) {
    throw new Error('Not using a test database! Aborting reset.');
  }

  const tablesInOrder = [
    'BannedEmail',
    'ProjectMember',
    'ActivityLog',
    'TicketLabel',
    'Label',
    'Attachment',
    'User',
    'Comment',
    'Ticket',
    'Board',
    'Project',
    'Organization',
    'OrganizationProjectUsage',
    'OrganizationBoardUsage',
    'OrganizationTicketUsage',
    'OrganizationCommentUsage',
    'OrganizationUserUsage',
    'OrganizationLabelUsage',
    'OrganizationActivityLogUsage',
    'OrganizationFileStorageUsage',
    'OrganizationBannedEmailsUsage',
  ];

  await prismaTest.$transaction(async (tx) => {
    for (const table of tablesInOrder) {
      await tx.$executeRawUnsafe(
        `TRUNCATE TABLE "${table}" RESTART IDENTITY CASCADE`
      );
    }
  });
}
