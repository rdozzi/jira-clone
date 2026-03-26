import { TokenPurpose, User } from '@prisma/client';

export function isUserValidForToken(
  user: User,
  purpose: TokenPurpose,
): boolean {
  if (!user || user.isDeleted || user.isBanned || user.isDemoUser) {
    return false;
  }

  switch (purpose) {
    case 'RESET_PASSWORD':
      return true;

    case 'ACCOUNT_ACTIVATION':
      return !user.isEmailVerified;

    case 'ACCOUNT_INVITE':
      return !user.isEmailVerified && !!user.organizationId;

    default:
      return false;
  }
}
