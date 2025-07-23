import { LogEventPayload } from '../types/logEventPayload';

export function buildLogEvent({
  userId,
  actorType,
  action,
  targetId,
  targetType,
  organizationId,
  metadata,
}: LogEventPayload) {
  return {
    userId: userId || null,
    actorType: actorType,
    action: action,
    targetId: targetId || null,
    targetType: targetType,
    organizationId: organizationId,
    metadata: metadata || {},
  };
}
