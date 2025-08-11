import { PrismaClient } from '@prisma/client';
import { TOTAL_ORG_LIMITS } from './limits';
import { getOrgResourceTotal } from './getOrgResourceTotal';

type TotalOrgLimit = keyof typeof TOTAL_ORG_LIMITS;

export async function checkTotalMaxCount(
  prisma: PrismaClient,
  resourceType: TotalOrgLimit,
  organizationId: number
) {
  try {
    const total = await getOrgResourceTotal(
      prisma,
      resourceType,
      organizationId
    );

    const isTotalAboveZero = total > 0;
    return isTotalAboveZero;
  } catch (error) {
    throw new Error(`Could not obtain resource count: ${error}`);
  }
}
