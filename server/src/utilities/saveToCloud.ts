import { PutObjectCommand } from '@aws-sdk/client-s3';
import { s3 } from '../lib/s3Client';
import { FileMetadata } from '../types/file';

async function saveToCloud(file: Express.Multer.File): Promise<FileMetadata> {
  const filename = `${Date.now()}-${file.originalname}`;
  const bucket = process.env.AWS_S3_BUCKET!;

  await s3.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: filename,
      Body: file.buffer,
      ContentType: file.mimetype,
    })
  );

  const cloudUrl = `https://${bucket}.s3.amazonaws.com/${filename}`;

  return {
    filename,
    mimetype: file.mimetype,
    size: file.size,
    storageType: 'CLOUD',
    cloudUrl,
  };
}

export default saveToCloud;
