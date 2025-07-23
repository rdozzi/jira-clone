import { GlobalRole, OrganizationRole } from '@prisma/client';

export interface DecodedTokenPayload {
  id: number;
  email: string;
  organizationRole: OrganizationRole;
  globalRole: GlobalRole;
  organizationId: number;
  iat?: number;
  exp?: number;
}
