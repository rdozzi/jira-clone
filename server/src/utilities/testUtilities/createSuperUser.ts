import { GlobalRole, PrismaClient } from '@prisma/client';
import { hashPassword } from '../password';

export async function createSuperUser(
  prismaTest: PrismaClient,
  testDescription: string
) {
  const email = `globalSuperUser_${testDescription}@example.com`;
  const user = await prismaTest.user.findUnique({
    where: { email: email },
  });

  if (user) {
    return user;
  } else {
    const user = await prismaTest.user.create({
      data: {
        email: `globalSuperUser_${testDescription}@example.com`,
        firstName: `SuperUser_${testDescription}_firstName`,
        lastName: `SuperUser_${testDescription}_lastName`,
        passwordHash: await hashPassword('seedPassword123'),
        globalRole: GlobalRole.SUPERUSER,
      },
    });
    return user;
  }
}
