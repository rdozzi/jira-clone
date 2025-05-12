import { GlobalRole } from '@prisma/client';

export interface DecodedTokenPayload {
  id: number;
  email: string;
  globalRole: GlobalRole;
  iat?: number;
  exp?: number;
}
