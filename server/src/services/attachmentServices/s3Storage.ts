import {
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import { s3 } from '../../lib/s3Client';

export async function uploadToS3(key: string, body: Buffer, mimetype: string) {
  try {
    const command = new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: key,
      Body: body,
      ContentType: mimetype,
    });

    return await s3.send(command);
  } catch (error) {
    console.error('S3 upload error:', error);
    throw new Error('S3 Upload Failed');
  }
}
export async function downloadFromS3(key: string) {
  try {
    const command = new GetObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: key,
    });

    const response = await s3.send(command);
    return response.Body;
  } catch (error) {
    console.error('S3 download error:', error);
    throw new Error('S3 Download Failed');
  }
}
export async function deleteFromS3(key: string) {
  try {
    const command = new DeleteObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: key,
    });

    return await s3.send(command);
  } catch (error) {
    console.error('S3 delete error:', error);
    throw new Error('S3 Delete Failed');
  }
}
