import { connectRedis, redisClient } from '../../lib/connectRedis';
import { PrismaClient, Prisma } from '@prisma/client';
import { ResourceType } from '../../types/ResourceAndColumnTypes';
import { increaseCount } from './dailyLimitCounters';
import { getColumnfromResource } from './getColumnfromResource';
import { TOTAL_ORG_LIMITS } from './limits';

export async function createResourceService<T>(
  prisma: PrismaClient,
  resourceType: ResourceType,
  organizationId: number,
  doCreate: (tx: Prisma.TransactionClient) => Promise<T>,
  fileSize?: number
): Promise<T> {
  const isFile = resourceType === 'FileStorage';
  const columnName = getColumnfromResource(resourceType);

  const increment =
    isFile && typeof fileSize === 'number' && fileSize > 0 ? fileSize : 1;

  //Daily count increase via Redis (Returns the resource-specific key)
  const key = await increaseCount(resourceType, organizationId, increment);

  try {
    const result = await prisma.$transaction(
      async (tx) => {
        // Ensure row exists
        await tx.organizationUsage.upsert({
          where: { organizationId },
          create: { organizationId },
          update: {},
        });

        // Lock usage row
        const usage = await tx.$queryRaw<
          Array<{ value: bigint | number }>
        >(Prisma.sql`
      SELECT ${Prisma.raw(columnName)} AS value
      FROM "OrganizationUsage",
      WHERE "organizationId" = ${organizationId}
      FOR UPDATE`);

        const current = Number(usage[0]?.value ?? 0);
        const limit = TOTAL_ORG_LIMITS[resourceType];

        if (limit !== undefined && current + increment >= limit) {
          throw new Error('TOTAL_LIMIT');
        }

        // Increment Usage
        await tx.$executeRaw(Prisma.sql`
      UPDATE "OrganizationUsage"
      SET ${Prisma.raw(columnName)} = ${Prisma.raw(columnName)} + ${increment}
      WHERE "organizationId" = ${organizationId}`);

        const entity = await doCreate(tx);
        return entity;
      },
      { isolationLevel: 'Serializable' }
    );

    return result;
  } catch (error) {
    try {
      if (key) {
        await connectRedis();
        await redisClient.decrby(key, increment);
      }
    } catch (rollBackErr) {
      console.error('Redis rollback failed:', rollBackErr);
    }
    if ((error as Error).message === 'TOTAL_LIMIT') {
      throw new Error(
        `Organization capacity has been reached for resource: ${resourceType}`
      );
    }
    throw error;
  }
}
