export function getStorageType() {
  // This function determines the storage type based on the environment variable
  const storage = process.env.STORAGE_TYPE || 'local';
  if (storage !== 'local' && storage !== 'db') {
    throw new Error(`Invalid storage type: ${storage}`);
  }
  return storage;
}
