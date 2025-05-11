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
  //     first_name: 'Bob',
  //     last_name: 'Newhart',
  //     passwordHash: hashedPassword,
  //     role: 'USER',
  //   },
  // });

  // const user2 = await prisma.user.upsert({
  //   where: { id: 2 },
  //   update: { deletedAt: null },
  //   create: {
  //     email: 'user2@example.com',
  //     first_name: 'Sally',
  //     last_name: 'Fields',
  //     passwordHash: hashedPassword,
  //     role: 'USER',
  //   },
  // });

  const user4 = await prisma.user.upsert({
    where: { id: 4 },
    update: { deletedAt: null, role: 'GUEST' },
    create: {
      email: 'fdrescher@example.com',
      first_name: 'Fran',
      last_name: 'Drescher',
      passwordHash: hashedPassword,
      role: 'GUEST',
    },
  });

  const user5 = await prisma.user.upsert({
    where: { id: 5 },
    update: { deletedAt: null, role: 'ADMIN' },
    create: {
      email: 'mfreeman@example.com',
      first_name: 'Morgan',
      last_name: 'Freeman',
      passwordHash: hashedPassword,
      role: 'ADMIN',
    },
  });

  return { user4, user5 };
}
