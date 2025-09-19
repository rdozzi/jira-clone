import { Request, Response, NextFunction } from 'express';
// import { ipQualityScoreService } from '../../services/setupServices/ipQualityScoreService';

export function verifyEmail() {
  return async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    // const { email } = res.locals.validatedBody;
    //Remove email inquiry for testing and dev purposes.
    // const emailResult = await ipQualityScoreService(email);

    // if (!emailResult.safe) {
    //   res
    //     .status(403)
    //     .json({ message: 'Request denied. Suspicious IP address.' });
    //   return;
    // }
    next();
  };
}
