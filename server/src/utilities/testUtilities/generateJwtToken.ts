import jwt from 'jsonwebtoken';
import { GlobalRole } from '@prisma/client';

export function generateJwtToken(userId: number, globalRole: GlobalRole) {
  const token = jwt.sign(
    { id: userId, globalRole: globalRole },
    process.env.JWT_SECRET!,
    { expiresIn: '1hr' }
  );
  return token;
}

export default generateJwtToken;
