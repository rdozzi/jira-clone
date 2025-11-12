export interface ActivityLogs {
  id: number;
  userId: number;
  actorType: 'USER' | 'SYSTEM';
  action: string;
  targetId: number;
  targetType: string;
  metadata: { [key: string]: any };
  createdAt: Date;
  organizationId: number;
}
