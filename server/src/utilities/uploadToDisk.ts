import path from 'path';
import fs from 'fs';
import { FileMetadata } from '../types/file';

export async function saveToLocal(
  file: Express.Multer.File
): Promise<FileMetadata> {
  // const dest = path.resolve(file.destination);
  const uploadDirectory = path.join(__dirname, '..', '..', 'uploads');
  if (!fs.existsSync(uploadDirectory)) {
    fs.mkdirSync(uploadDirectory, { recursive: true });
  }

  return {
    filename: file.filename,
    mimetype: file.mimetype,
    size: file.size,
    storageLocation: 'LOCAL',
    savedPath: file.path,
  };
}
