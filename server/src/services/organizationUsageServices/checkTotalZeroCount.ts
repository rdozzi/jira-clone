import { PrismaClient } from '@prisma/client';
import { getOrgResourceTotal } from './getOrgResourceTotal';
import { ResourceType } from '../../types/ResourceAndColumnTypes';

export async function checkTotalZeroCount(
  prisma: PrismaClient,
  resourceType: ResourceType,
  organizationId: number
) {
  try {
    const total = await getOrgResourceTotal(
      prisma,
      resourceType,
      organizationId
    );

    const isTotalCountAboveZero = total > 0;
    return isTotalCountAboveZero;
  } catch (error) {
    throw new Error(`Could not obtain resource count: ${error}`);
  }
}
