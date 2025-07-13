import { GlobalRole, PrismaClient } from '@prisma/client';
import { hashPassword } from '../password';

export async function createUserProfile(
  prismaTest: PrismaClient,
  testDescription: string,
  globalRole: GlobalRole
) {
  const email = `global_${globalRole}_${testDescription}@example.com`;
  const user = await prismaTest.user.findUnique({
    where: { email: email },
  });

  if (user) {
    return user;
  } else {
    const user = await prismaTest.user.create({
      data: {
        email: `global_${globalRole}_${testDescription}@example.com`,
        firstName: `User_${testDescription}_firstName`,
        lastName: `User_${testDescription}_lastName`,
        passwordHash: await hashPassword('seedPassword123'),
        globalRole: globalRole,
      },
    });
    return user;
  }
}
