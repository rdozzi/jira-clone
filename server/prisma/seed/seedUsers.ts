import { hashPassword } from '../../src/password';
import { PrismaClient } from '@prisma/client';

export async function seedUsers(prisma: PrismaClient) {
  const hashedPassword = await hashPassword('seedPassword123');

  // Seed Users
  const user1 = await prisma.user.upsert({
    where: { email: 'user1@example.com' },
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
    where: { email: 'user2@example.com' },
    update: {},
    create: {
      email: 'user2@example.com',
      first_name: 'Sally',
      last_name: 'Fields',
      passwordHash: hashedPassword,
      role: 'USER',
    },
  });

  console.log(
    `Created users: ${user1.first_name} ${user1.last_name} , ${user2.first_name} ${user2.last_name}`
  );

  return { user1, user2 };
}
