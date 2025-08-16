import { PrismaClient } from '@prisma/client';
import { TOTAL_ORG_LIMITS } from './limits';
import { getTotalAndMaxForResource } from './getTotalAndMaxForResource';

export type TotalOrgLimit = keyof typeof TOTAL_ORG_LIMITS;

export async function checkTotalMaxCount(
  prisma: PrismaClient,
  resourceType: TotalOrgLimit,
  organizationId: number
) {
  try {
    // Total will return the resource count or 0; max will return the max limit or null
    const { total, max } = await getTotalAndMaxForResource(
      prisma,
      resourceType,
      organizationId
    );

    if (!max) {
      return true;
    }

    const totalBelowMax = total < max;
    return totalBelowMax;
  } catch (error) {
    throw new Error(`Could not obtain resource count: ${error}`);
  }
}
