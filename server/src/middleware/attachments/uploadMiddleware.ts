import multer from 'multer';
import { Request } from 'express';
import path from 'path';
import fs from 'fs';
import { getStorageType } from '../../config/storage';

const storageType = getStorageType();

let upload: multer.Multer;
if (storageType === 'LOCAL') {
  const localUploadPath = path.join(__dirname, '..', '..', 'uploads');

  if (!fs.existsSync(localUploadPath)) {
    fs.mkdirSync(localUploadPath, { recursive: true });
  }

  const storage = multer.diskStorage({
    destination: (req: Request, file: Express.Multer.File, cb) => {
      const destination = (req.query.path as string) || localUploadPath;
      if (!fs.existsSync(destination)) {
        fs.mkdirSync(destination, { recursive: true });
      }
      cb(null, destination);
    },
    filename: (req: Request, file: Express.Multer.File, cb) => {
      const fileName = `${Date.now()}-${file.originalname}`;
      cb(null, fileName);
    },
  });

  upload = multer({
    storage,
  });
} else if (storageType === 'CLOUD') {
  upload = multer({ storage: multer.memoryStorage() });
} else {
  throw new Error(`Invalid storage type: ${storageType}`);
}

export const uploadSingleMiddleware = upload.single('file');
export const uploadMultipleMiddleware = upload.array('files', 10);
