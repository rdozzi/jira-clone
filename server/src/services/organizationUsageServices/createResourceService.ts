import { connectRedis, redisClient } from '../../lib/connectRedis';
import { PrismaClient, Prisma } from '@prisma/client';
import { ResourceType } from '../../types/ResourceAndColumnTypes';
import { increaseCount } from './dailyLimitCounters';
import { getTableInfo } from './getTableInfo';
import { TOTAL_ORG_LIMITS } from './limits';

export async function createResourceService<T>(
  prisma: PrismaClient,
  resourceType: ResourceType,
  organizationId: number,
  doCreate: (tx: Prisma.TransactionClient) => Promise<T>,
  fileSize?: number
): Promise<T> {
  const isFile = resourceType === 'FileStorage';
  const { table, total, max } = getTableInfo(resourceType);

  const increment =
    isFile && typeof fileSize === 'number' && fileSize > 0 ? fileSize : 1;

  //Daily count increase via Redis (Returns the resource-specific key)
  const key = await increaseCount(resourceType, organizationId, increment);

  try {
    const result = await prisma.$transaction(
      async (tx) => {
        // Lock usage row
        const [row] = await tx.$queryRaw<
          Array<{ totalResource: number; maximum: number }>
        >(Prisma.sql`
      SELECT ${Prisma.raw(`"${total}"`)} AS totalResource, ${Prisma.raw(`"${max}"`)} AS maximum
      FROM ${Prisma.raw(`"${table}"`)}
      WHERE "organizationId" = ${organizationId}
      FOR UPDATE`);

        if (!row) {
          throw new Error(
            `Organization usage row missing for ${resourceType} (orgId=${organizationId}). Check seeding logic.`
          );
        }

        const totalResource: bigint | number = row.totalResource;
        let maximum: bigint | number = row.maximum;

        if (maximum == null) {
          maximum = TOTAL_ORG_LIMITS[resourceType];
        }

        const current = Number(totalResource ?? 0);
        const limit = Number(maximum);

        if (limit && current + increment > limit) {
          throw new Error('TOTAL_LIMIT');
        }

        // Increment Usage
        await tx.$executeRaw(Prisma.sql`
      UPDATE ${Prisma.raw(`"${table}"`)}
      SET ${Prisma.raw(`"${total}"`)} = ${Prisma.raw(`"${total}"`)} + ${increment}
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
        await redisClient.decrBy(key, increment);
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
