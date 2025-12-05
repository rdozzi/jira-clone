import { getStorageType } from '../config/storage';
import { uploadToCloud } from './uploadToCloud';
import { saveToLocal } from './saveToLocal';
import { FileMetadata } from '../types/file';
import { StorageType } from '@prisma/client';

export async function storageDispatcher(
  file: Express.Multer.File,
  organizationId: number,
  entityType: string,
  entityId: number
): Promise<FileMetadata> {
  const type: StorageType = getStorageType();
  switch (type) {
    case 'LOCAL':
      return saveToLocal(file);
    case 'CLOUD':
      return uploadToCloud(file, organizationId, entityType, entityId);
    default:
      throw new Error(`Invalid storage destination: ${type}`);
  }
}
