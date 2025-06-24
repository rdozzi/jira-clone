import { prismaTest } from '../../lib/prismaTestClient';
import dotenv from 'dotenv';

dotenv.config();

export async function resetTestDatabase() {
  if (!process.env.DATABASE_URL?.includes('test')) {
    throw new Error('Not using a test database! Aborting reset.');
  }

  const tablesInOrder = [
    'bannedEmail',
    'projectMember',
    'activityLog',
    'ticketLabel',
    'label',
    'attachment',
    'user',
    'comment',
    'ticket',
    'board',
    'project',
  ];

  await prismaTest.$transaction(async (tx) => {
    tablesInOrder.map((table) => {
      tx.$executeRawUnsafe(
        `TRUNCATE TABLE "${table}" RESTART IDENTITY CASCADE`
      );
    });
  });
}
