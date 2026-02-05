import { hashPassword } from '../../src/utilities/password';
import { PrismaClient } from '@prisma/client';
import { logSeedUtility } from '../../src/utilities/logSeedUtility';

export async function seedUsers(prisma: PrismaClient) {
  const hashedPassword = await hashPassword('seedPassword123');

  const seeds = [{ id: 4 }, { id: 5 }];
  const modelName = 'User';
  logSeedUtility({ seeds, modelName, prisma });

  // Seed Users
  // const user1 = await prisma.user.upsert({
  //   where: { id: 1 },
  //   update: { deletedAt: null, role: 'USER' },
  //   create: {
  //     email: 'user1@example.com',
  //     firstName: 'Bob',
  //     lastName: 'Newhart',
  //     passwordHash: hashedPassword,
  //     globalRole: 'USER',
  //   },
  // });

  // const user2 = await prisma.user.upsert({
  //   where: { id: 2 },
  //   update: { deletedAt: null },
  //   create: {
  //     email: 'user2@example.com',
  //     firstName: 'Sally',
  //     lastName: 'Fields',
  //     passwordHash: hashedPassword,
  //     globalRole: 'USER',
  //   },
  // });

  const user4 = await prisma.user.upsert({
    where: { id: 4 },
    update: { deletedAt: null, globalRole: 'GUEST' },
    create: {
      email: 'fdrescher@example.com',
      firstName: 'Fran',
      lastName: 'Drescher',
      passwordHash: hashedPassword,
      globalRole: 'GUEST',
    },
  });

  const user5 = await prisma.user.upsert({
    where: { id: 5 },
    update: { deletedAt: null, globalRole: 'ADMIN' },
    create: {
      email: 'mfreeman@example.com',
      firstName: 'Morgan',
      lastName: 'Freeman',
      passwordHash: hashedPassword,
      globalRole: 'ADMIN',
    },
  });

  return { user4, user5 };
}
