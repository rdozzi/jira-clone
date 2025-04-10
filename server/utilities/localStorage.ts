import path from 'path';
import { promises as fs } from 'fs';
import { FileMetadata } from '../types/file';

export async function saveToLocal(file): Promise<FileMetadata> {
  const storagePath = path.join(__dirname, '../uploads');
  const filePath = path.join(storagePath, file.originalname);

  try {
    await fs.mkdir(storagePath, { recursive: true });
    await fs.writeFile(filePath, file.buffer);
    return {
      filename: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
      storageLocation: 'local',
      savedPath: filePath,
    };
  } catch (error) {
    console.error('Error saving file to local storage:', error);
    throw error;
  }
}
