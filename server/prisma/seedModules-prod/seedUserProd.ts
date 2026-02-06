import { Prisma } from '@prisma/client';
import { hashPassword } from '../../src/utilities/password';

export async function seedUserProd(
  tx: Prisma.TransactionClient,
  organizationId: number,
) {
  if (!process.env.DEMO_PASSWORD) {
    throw new Error('DEMO_PASSWORD is not set');
  }
  const hashedPassword = await hashPassword(process.env.DEMO_PASSWORD);

  const user = await tx.user.upsert({
    where: { email: 'demo@jira-clone.local' },
    update: {},
    create: {
      firstName: 'Demo',
      lastName: 'User',
      email: 'demo@jira-clone.local',
      passwordHash: hashedPassword,
      organizationRole: 'SUPERADMIN',
      globalRole: 'USER',
      organizationId: organizationId,
    },
  });

  return user;
}
