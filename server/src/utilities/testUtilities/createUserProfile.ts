import { OrganizationRole, PrismaClient, GlobalRole } from '@prisma/client';
import { hashPassword } from '../password';

export async function createUserProfile(
  prismaTest: PrismaClient,
  testDescription: string,
  organizationRole: OrganizationRole,
  organizationId: number,
  options?: {
    mustChangePassword?: boolean;
    isEmailVerified?: boolean;
    isDemoUser?: boolean;
  },
) {
  const email = `organizationUser_${organizationRole}_${testDescription}@example.com`;
  const emailLowerCase = email.toLowerCase();
  const { mustChangePassword = false } = options || {};
  const { isEmailVerified = true } = options || {};
  const user = await prismaTest.user.findUnique({
    where: { email: emailLowerCase },
  });

  if (user) {
    return user;
  } else {
    const user = await prismaTest.user.create({
      data: {
        email: emailLowerCase,
        firstName: `User_${testDescription}_firstName`,
        lastName: `User_${testDescription}_lastName`,
        passwordHash: await hashPassword('seedPassword123'),
        globalRole: GlobalRole.USER,
        organizationRole: organizationRole,
        organizationId: organizationId,
        mustChangePassword: mustChangePassword,
        isEmailVerified: isEmailVerified,
        isDemoUser: false,
      },
    });
    return user;
  }
}
