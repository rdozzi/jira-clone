import path from 'path';
import fs from 'fs';
import { FileMetadata } from '../types/file';

export async function saveToLocal(
  file: Express.Multer.File
): Promise<FileMetadata> {
  const dest = path.resolve(file.destination);

  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  return {
    filename: file.filename,
    mimetype: file.mimetype,
    size: file.size,
    storageLocation: 'LOCAL',
    savedPath: path.join(dest, file.filename),
  };
}
