import { PrismaClient, GlobalRole } from '@prisma/client';
import { hashPassword } from '../password';

export async function createGlobalGuest(prismaTest: PrismaClient) {
  const email = 'globalGuest@example.com';
  const existing = await prismaTest.user.findUnique({
    where: { email: email },
  });

  if (existing) {
    return existing;
  } else {
    return await prismaTest.user.upsert({
      where: { email },
      update: {},
      create: {
        email: 'globalGuest@example.com',
        firstName: 'Global.Guest',
        lastName: null,
        passwordHash: await hashPassword('seedPassword123'),
        globalRole: GlobalRole.GUEST,
      },
    });
  }
}

export async function createGlobalUser(prismaTest: PrismaClient) {
  const email = 'globalUser@example.com';
  const existing = await prismaTest.user.findUnique({
    where: { email: email },
  });

  if (existing) {
    return existing;
  } else {
    return await prismaTest.user.upsert({
      where: { email },
      update: {},
      create: {
        email: 'globalUser@example.com',
        firstName: 'Global.User',
        lastName: null,
        passwordHash: await hashPassword('seedPassword123'),
        globalRole: GlobalRole.USER,
      },
    });
  }
}

export async function createGlobalAdmin(prismaTest: PrismaClient) {
  const email = 'globalAdmin@example.com';
  const existing = await prismaTest.user.findUnique({
    where: { email: email },
  });

  if (existing) {
    return existing;
  } else {
    return await prismaTest.user.upsert({
      where: { email },
      update: {},
      create: {
        email: email,
        firstName: 'Global.Admin',
        lastName: null,
        passwordHash: await hashPassword('seedPassword123'),
        globalRole: GlobalRole.ADMIN,
      },
    });
  }
}

export async function createGlobalSuperAdmin(prismaTest: PrismaClient) {
  const email = 'globalSuperAdmin@example.com';
  const existing = await prismaTest.user.findUnique({
    where: { email: email },
  });

  if (existing) {
    return existing;
  } else {
    return await prismaTest.user.upsert({
      where: { email },
      update: {},
      create: {
        email: 'globalSuperAdmin@example.com',
        firstName: 'Global.SuperAdmin',
        lastName: null,
        passwordHash: await hashPassword('seedPassword123'),
        globalRole: GlobalRole.SUPERADMIN,
      },
    });
  }
}
