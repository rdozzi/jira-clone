import { PutObjectCommand } from '@aws-sdk/client-s3';
import { s3 } from '../lib/s3Client';
import { FileMetadata } from '../types/file';
import { randomUUID } from 'crypto';

export async function uploadToCloud(
  file: Express.Multer.File,
  organizationId: number,
  entityType: string,
  entityId: number
): Promise<FileMetadata> {
  try {
    const { originalname, buffer: body, mimetype } = file;
    const key = `org-${organizationId}/${entityType}-${entityId}/${randomUUID()}-${originalname}`;
    const command = new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: key,
      Body: body,
      ContentType: mimetype,
    });

    const fileResponse = await s3.send(command);

    const fileMetadata: FileMetadata = {
      filename: originalname,
      mimetype: mimetype,
      size: fileResponse.Size ? fileResponse.Size : -1,
      storageType: 'CLOUD' as const,
      fileUrl: key,
    };

    return fileMetadata;
  } catch (error) {
    console.error('S3 upload error:', error);
    throw new Error('S3 Upload Failed');
  }
}
