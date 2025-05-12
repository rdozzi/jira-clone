import { Express } from 'express';

export interface CustomFile extends Express.Multer.File {
  storageType: 'LOCAL' | 'CLOUD';
  filePath: string;
  uploadedBy: number;
  fileName: string;
  entityType: string;
  fileSize: number;
  fileUrl: string;
  id: number;
  entityId?: number;
}
