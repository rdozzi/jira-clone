import { FileMetadata } from '../types/file';
import { storageDispatcher } from '../utilities/storageDispatcher';

export async function handleFileUpload(
  file: Express.Multer.File,
  organizationId: number,
  entityType: string,
  entityId: number
): Promise<FileMetadata> {
  if (!file) {
    throw new Error('No file uploaded');
  }
  return storageDispatcher(file, organizationId, entityType, entityId);
}
