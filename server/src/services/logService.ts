import { ActivityLog } from '@prisma/client';
import { LogEventPayload } from '../types/logEventPayload';
import prisma from '../lib/prisma';
import { logBus } from '../lib/logBus';

export function initLogService() {
  logBus.on('activityLog', async (activityLogs: LogEventPayload[]) => {
    for (const activityLog of activityLogs) {
      try {
        await createActivityLog(activityLog);
      } catch (error) {
        console.error('Activity log write failed:', error);
      }
    }
  });
}

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

    return activityLog;
  } catch (error) {
    console.error('Error creating activity log: ', error);
    return null;
  }
}
