import { LogEventPayload } from '../types/logEventPayload';

export function buildLogEvent({
  userId,
  actorType,
  action,
  targetId,
  targetType,
  metadata,
}: LogEventPayload) {
  return {
    userId: userId || null,
    actorType: actorType,
    action: action,
    targetId: targetId || null,
    targetType: targetType,
    metadata: metadata || {},
  };
}
