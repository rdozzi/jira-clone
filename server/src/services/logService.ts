import { ActivityLog } from '@prisma/client';
import { LogEventPayload } from '../types/logEventPayload';
import prisma from '../lib/prisma';

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
    return await prisma.activityLog.create({
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
  } catch (error) {
    console.error('Error creating activity log: ', error);
    return null;
  }
}
