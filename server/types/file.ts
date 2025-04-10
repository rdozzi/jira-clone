export interface FileMetadata {
  filename: string;
  mimetype: string;
  size: number;
  storageLocation: 'local' | 'cloud' | 'db';
  savedPath?: string;
  cloudUrl?: string;
  dbId?: string;
}
