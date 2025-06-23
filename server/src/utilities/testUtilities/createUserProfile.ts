import { PrismaClient, GlobalRole } from '@prisma/client';

export async function createGlobalGuest(prismaTest: PrismaClient) {
  return await prismaTest.user.create({
    data: {
      email: 'globalGuest@example.com',
      firstName: 'Global.Guest',
      lastName: null,
      passwordHash: 'seedPassword123',
      globalRole: GlobalRole.GUEST,
    },
  });
}

export async function createGlobalUser(prismaTest: PrismaClient) {
  return await prismaTest.user.create({
    data: {
      email: 'globalUser@example.com',
      firstName: 'Global.User',
      lastName: null,
      passwordHash: 'seedPassword123',
      globalRole: GlobalRole.USER,
    },
  });
}

export async function createGlobalAdmin(prismaTest: PrismaClient) {
  return await prismaTest.user.create({
    data: {
      email: 'globalAdmin@example.com',
      firstName: 'Global.Admin',
      lastName: null,
      passwordHash: 'seedPassword123',
      globalRole: GlobalRole.ADMIN,
    },
  });
}

export async function createGlobalSuperAdmin(prismaTest: PrismaClient) {
  return await prismaTest.user.create({
    data: {
      email: 'globalSuperAdmin@example.com',
      firstName: 'Global.SuperAdmin',
      lastName: null,
      passwordHash: 'seedPassword123',
      globalRole: GlobalRole.SUPERADMIN,
    },
  });
}
