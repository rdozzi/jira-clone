import { ActivityLog } from '@prisma/client';
import { LogEventPayload } from '../types/logEventPayload';
import prisma from '../lib/prisma';
import { activityLogCounter } from './organizationUsageServices/activityLogCounter';

export async function createActivityLog({
  userId,
  actorType,
  action,
  targetId,
  targetType,
  organizationId,
  metadata,
}: LogEventPayload): Promise<ActivityLog | null> {
  try {
    const activityLog = await prisma.activityLog.create({
      data: {
        userId,
        actorType,
        action,
        targetId,
        targetType,
        organizationId,
        metadata,
      },
    });

    if (organizationId != null) {
      try {
        await activityLogCounter(prisma, organizationId);
      } catch (error) {
        console.warn('Function activityLogCounter failed:', error);
      }
    }

    return activityLog;
  } catch (error) {
    console.error('Error creating activity log: ', error);
    return null;
  }
}
