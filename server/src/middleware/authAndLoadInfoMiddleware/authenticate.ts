import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { Response, NextFunction, RequestHandler } from 'express';
import { CustomRequest } from '../../types/CustomRequest';
import { DecodedTokenPayload } from '../../types/DecodedTokenPayload';

dotenv.config();

function authenticateFn(req: CustomRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized. No token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    const payload = decoded as DecodedTokenPayload;

    if (!payload.id || !payload.globalRole) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    req.user = {
      id: payload.id,
      globalRole: payload.globalRole,
      organizationId: payload.organizationId,
      organizationRole: payload.organizationRole,
    };

    next();
  } catch (error) {
    console.error('Token verification failed:', error);
    return res.status(401).json({ message: 'Unauthorized. Invalid token' });
  }
}

export const authenticate = authenticateFn as unknown as RequestHandler;
