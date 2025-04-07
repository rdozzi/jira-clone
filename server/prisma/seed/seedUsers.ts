import { hashPassword } from '../../src/password';
import { PrismaClient } from '@prisma/client';
import { logSeedUtility } from '../../utility/logSeedUtility';

export async function seedUsers(prisma: PrismaClient) {
  const hashedPassword = await hashPassword('seedPassword123');

  const seeds = [{ id: 1 }, { id: 2 }];
  const modelName = 'User';
  logSeedUtility({ seeds, modelName, prisma });

  // Seed Users
  const user1 = await prisma.user.upsert({
    where: { id: 1 },
    update: {},
    create: {
      email: 'user1@example.com',
      first_name: 'Bob',
      last_name: 'Newhart',
      passwordHash: hashedPassword,
      role: 'USER',
    },
  });

  const user2 = await prisma.user.upsert({
    where: { id: 2 },
    update: {},
    create: {
      email: 'user2@example.com',
      first_name: 'Sally',
      last_name: 'Fields',
      passwordHash: hashedPassword,
      role: 'USER',
    },
  });

  return { user1, user2 };
}
