import { LogEventPayload } from '../types/logEventPayload';

export function buildLogEvent({
  userId,
  actorType,
  action,
  targetId,
  targetType,
  metadata,
  ticketId,
  projectId,
  boardId,
}: LogEventPayload) {
  return {
    userId: userId || null,
    actorType: actorType,
    action: action,
    targetId: targetId || null,
    targetType: targetType,
    metadata: metadata || {},
    ticketId: ticketId || null,
    projectId: projectId || null,
    boardId: boardId || null,
  };
}
