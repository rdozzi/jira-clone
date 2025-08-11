import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { getResourceFromPath } from '../../services/organizationUsageServices/getResourceFromPath';
import { checkDailyZeroCount } from '../../services/organizationUsageServices/checkDailyZeroCount';
import { checkTotalZeroCount } from '../../services/organizationUsageServices/checkTotalZeroCount';

export function checkZeroUsageTotals(prisma: PrismaClient) {
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

    const isAboveDailyZero = await checkDailyZeroCount(
      resourceType,
      organizationId
    );

    if (!isAboveDailyZero) {
      res.status(403).json({
        message: `No records exist. Cannot use delete function.`,
      });
      return;
    }

    const isAboveTotalZero = await checkTotalZeroCount(
      prisma,
      resourceType,
      organizationId
    );

    if (!isAboveTotalZero) {
      res.status(403).json({
        message: `No records exist. Cannot use delete function.`,
      });
      return;
    }

    res.locals.resourceType = resourceType;
    next();
  };
}
