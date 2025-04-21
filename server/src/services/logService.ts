import { ActivityLog } from '@prisma/client';
import { LogEventPayload } from '../types/logEventPayload';
import prisma from '../lib/prisma';

export async function createActivityLog({
  userId,
  actorType,
  action,
  targetId,
  targetType,
  metadata,
  ticketId,
  projectId,
  boardId,
}: LogEventPayload): Promise<ActivityLog | null> {
  try {
    return await prisma.activityLog.create({
      data: {
        userId,
        actorType,
        action,
        targetId,
        targetType,
        metadata,
        ticketId,
        projectId,
        boardId,
      },
    });
  } catch (error) {
    console.error('Error creating activity log: ', error);
    return null;
  }
}
