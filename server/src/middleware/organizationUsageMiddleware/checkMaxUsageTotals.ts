import { Request, Response, NextFunction } from 'express';
import { checkDailyMaxCount } from '../../services/organizationUsageServices/checkDailyMaxCount';
import { checkTotalMaxCount } from '../../services/organizationUsageServices/checkTotalMaxCount';
import { PrismaClient } from '@prisma/client';
import { getResourceFromPath } from '../../services/organizationUsageServices/getResourceFromPath';

export function checkMaxUsageTotals(prisma: PrismaClient) {
  return async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const organizationId = res.locals.userInfo.organizationId;

    const path = req.path.split('/');
    const pathResource = path.filter(Boolean)[0];
    const resourceType = getResourceFromPath(pathResource);

    if (!resourceType) {
      res
        .status(400)
        .json({ message: 'Unknown or unsupported resource type.' });
      return;
    }

    const isBelowDailyCount = await checkDailyMaxCount(
      resourceType,
      organizationId
    );

    if (!isBelowDailyCount) {
      res.status(429).json({
        message: `Requests exceeds daily limit for this resource: ${resourceType}. Please try again later.`,
      });
      return;
    }

    const isBelowTotalLimit = await checkTotalMaxCount(
      prisma,
      resourceType,
      organizationId
    );

    if (!isBelowTotalLimit) {
      res.status(403).json({
        message: `The organization has reached the maximum limit of this resource: ${resourceType}. Please delete records or contact support.`,
      });
      return;
    }

    res.locals.resourceType = resourceType;
    next();
  };
}
