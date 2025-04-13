import { getStorageType } from '../config/storage';
import { saveToCloud } from './uploadToCloud';
import { saveToLocal } from './uploadToDisk';
import { FileMetadata } from '../types/file';

export async function storageDispatcher(
  file: Express.Multer.File,
  storageOverride?: 'LOCAL' | 'CLOUD'
): Promise<FileMetadata> {
  const type = storageOverride || getStorageType();
  switch (type) {
    case 'LOCAL':
      return saveToLocal(file);
    case 'CLOUD':
      return saveToCloud(file);
    default:
      throw new Error(`Invalid storage destination: ${type}`);
  }
}
