import { StorageType } from '@prisma/client';

type StorageLocation = StorageType;

export interface FileMetadata {
  filename: string;
  mimetype: string;
  size: number;
  storageLocation: StorageLocation;
  savedPath?: string;
  cloudUrl?: string;
}
