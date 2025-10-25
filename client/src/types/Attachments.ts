export type EntityType =
  | 'PROJECT'
  | 'BOARD'
  | 'TICKET'
  | 'COMMENT'
  | 'USER'
  | null;

export interface Attachment {
  id: number;
  entityType: EntityType;
  entityId: number;
  fileName: string;
  fileSize: number;
  fileType: string;
  fileUrl: string | null;
  filePath: string | null;
  uploadedBy: number;
  organizationId: number;
  createdAt: Date;
  deletedAt: Date;
  storageType: string;
}
