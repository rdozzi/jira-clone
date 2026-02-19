import jwt from 'jsonwebtoken';
import { GlobalRole, OrganizationRole } from '@prisma/client';

export function generateJwtToken(
  userId: number,
  globalRole: GlobalRole,
  organizationId: number | null,
  organizationRole: OrganizationRole | null,
) {
  const token = jwt.sign(
    {
      id: userId,
      globalRole: globalRole,
      organizationId: organizationId,
      organizationRole: organizationRole,
    },
    process.env.JWT_SECRET as string,
  );
  return token;
}

export default generateJwtToken;
