import { Request, Response, NextFunction } from 'express';
import { checkDailyCount } from '../../services/organizationUsageServices/checkDailyCount';
import { checkTotalCount } from '../../services/organizationUsageServices/checkTotalCount';
import { PrismaClient } from '@prisma/client';
import { getResourceFromPath } from '../../services/organizationUsageServices/getResourceFromPath';

export function checkUsageTotals(prisma: PrismaClient) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const organizationId = res.locals.userInfo.organizationId;

    const path = req.path.split('/');
    const pathResource = path.filter(Boolean)[0];
    const resourceType = getResourceFromPath(pathResource);

    if (!resourceType) {
      return res
        .status(400)
        .json({ message: 'Unknown or unsupported resource type.' });
    }

    const isBelowDailyCount = await checkDailyCount(
      resourceType,
      organizationId
    );

    if (!isBelowDailyCount) {
      res.status(429).json({
        message: `Requests exceeds daily limit for this resource: ${resourceType}. Please try again later.`,
      });
      return;
    }

    const isBelowTotalLimit = await checkTotalCount(
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
    next();
  };
}
