import { Request, Response, NextFunction } from 'express';
import domains from 'disposable-domains';
import wildcards from 'disposable-domains/wildcard.json';

export function checkDisposableDomains() {
  return async (req: Request, res: Response, next: NextFunction) => {
    const { email } = res.locals.validatedBody;
    const emailDomain = email.split('@')[1]?.toLowerCase();

    if (domains.includes(emailDomain) || wildcards.includes(emailDomain)) {
      res.status(403).json({
        message: 'Request denied. Disposable email addresses are not allowed.',
      });
      return;
    }

    next();
  };
}
