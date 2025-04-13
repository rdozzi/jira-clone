import { StorageType } from '@prisma/client';

export function getStorageType() {
  // This function determines the storage type based on the environment variable
  const storage = (process.env.STORAGE_TYPE || 'LOCAL') as StorageType;
  if (!Object.values) {
    throw new Error(`Invalid storage type: ${storage}`);
  }
  return storage;
}
