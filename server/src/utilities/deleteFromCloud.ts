import { DeleteObjectCommand } from '@aws-sdk/client-s3';
import { s3 } from '../lib/s3Client';

export async function deleteFromCloud(key: string) {
  try {
    const command = new DeleteObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: key,
    });

    return await s3.send(command);
  } catch (error) {
    console.error('S3 delete error:', error);
    throw new Error('S3 Delete Failed');
  }
}
