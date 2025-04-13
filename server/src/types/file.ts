type StorageLocation = 'LOCAL' | 'CLOUD';

export interface FileMetadata {
  filename: string;
  mimetype: string;
  size: number;
  storageLocation: StorageLocation;
  savedPath?: string;
  cloudUrl?: string;
}
