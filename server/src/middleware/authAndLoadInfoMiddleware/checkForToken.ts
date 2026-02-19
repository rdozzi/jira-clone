import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export function checkForToken(req: Request, res: Response, next: NextFunction) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
  const userId = parseInt((decoded as { id: string }).id, 10);
  const organizationId = parseInt(
    (decoded as { organizationId: string }).organizationId,
    10,
  );

  res.locals.userIdDecoded = userId;
  res.locals.organizationIdDecoded = organizationId;

  next();
}
