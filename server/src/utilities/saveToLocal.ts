import path from 'path';
import fs from 'fs';
import { FileMetadata } from '../types/file';

export async function saveToLocal(
  file: Express.Multer.File
): Promise<FileMetadata> {
  const rootDir = path.join(__dirname, '..', '..', 'uploads');
  if (!fs.existsSync(rootDir)) {
    fs.mkdirSync(rootDir, { recursive: true });
  }

  const filename = `${Date.now()}-${file.originalname}`;
  const fullPath = path.join(rootDir, filename);

  fs.writeFileSync(fullPath, file.buffer);

  return {
    filename: filename,
    mimetype: file.mimetype,
    size: file.size,
    storageType: 'LOCAL',
    savedPath: fullPath,
  };
}
