import { OrganizationRole, PrismaClient, GlobalRole } from '@prisma/client';
import { hashPassword } from '../password';

export async function createUserProfile(
  prismaTest: PrismaClient,
  testDescription: string,
  organizationRole: OrganizationRole,
  organizationId: number,
  options?: { mustChangePassword?: boolean },
) {
  const email = `organizationUser_${organizationRole}_${testDescription}@example.com`;
  const { mustChangePassword = false } = options || {};
  const user = await prismaTest.user.findUnique({
    where: { email: email },
  });

  if (user) {
    return user;
  } else {
    const user = await prismaTest.user.create({
      data: {
        email: `organizationUser_${organizationRole}_${testDescription}@example.com`,
        firstName: `User_${testDescription}_firstName`,
        lastName: `User_${testDescription}_lastName`,
        passwordHash: await hashPassword('seedPassword123'),
        globalRole: GlobalRole.USER,
        organizationRole: organizationRole,
        organizationId: organizationId,
        mustChangePassword: mustChangePassword,
      },
    });
    return user;
  }
}
