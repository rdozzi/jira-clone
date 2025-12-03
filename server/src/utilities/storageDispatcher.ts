import { getStorageType } from '../config/storage';
import { saveToCloud } from './uploadToCloud';
import { saveToLocal } from './saveToLocal';
import { FileMetadata } from '../types/file';
import { StorageType } from '@prisma/client';

export async function storageDispatcher(
  file: Express.Multer.File
): Promise<FileMetadata> {
  const type: StorageType = getStorageType();
  switch (type) {
    case 'LOCAL':
      return saveToLocal(file);
    case 'CLOUD':
      return saveToCloud(file);
    default:
      throw new Error(`Invalid storage destination: ${type}`);
  }
}
