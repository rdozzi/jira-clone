import { ActorTypeActivity } from '@prisma/client';

type JsonPrimitive = string | number | boolean;
export type Json = JsonPrimitive | { [key: string]: Json } | Json[];

export type LogEventPayload = {
  userId?: number;
  actorType?: ActorTypeActivity;
  action: string;
  targetId?: number | null;
  targetType: string;
  metadata: Json;
  ticketId?: number | null;
  projectId?: number | null;
  boardId?: number | null;
};
