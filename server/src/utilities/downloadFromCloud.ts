import { GetObjectCommand } from '@aws-sdk/client-s3';
import { s3 } from '../lib/s3Client';

type S3Body = AsyncIterable<Uint8Array> | ReadableStream<Uint8Array>;

async function streamToBuffer(stream: S3Body): Promise<Buffer> {
  const chunks: Uint8Array[] = [];
  for await (const chunk of stream as AsyncIterable<Uint8Array>) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }

  return Buffer.concat(chunks);
}

export async function downloadFromCloud(key: string): Promise<Buffer> {
  try {
    const command = new GetObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: key,
    });

    const response = await s3.send(command); // Response body is a stream

    if (!response.Body) {
      throw new Error('S3 returned no response body.');
    }

    const file = await streamToBuffer(response.Body as S3Body);
    return file;
  } catch (error) {
    console.error('S3 download error:', error);
    throw new Error('S3 Download Failed');
  }
}
