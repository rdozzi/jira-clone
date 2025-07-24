import { existsSync, mkdirSync } from 'fs';
import { readdir, copyFile, stat } from 'fs/promises';
import path from 'path';
import {
  PrismaClient,
  AttachmentEntityType,
  StorageType,
} from '@prisma/client';

type Extension = 'txt' | 'pdf' | 'png' | 'jpg' | 'zip';

export async function createTestAttachment(
  prismaTest: PrismaClient,
  testDescription: string,
  entityId: number,
  entityType: AttachmentEntityType,
  userId: number,
  extension: Extension,
  organizationId: number
) {
  const uploadDir = path.join(__dirname, '../../../uploads');
  // Check for the upload directory
  if (!existsSync(uploadDir)) {
    mkdirSync(uploadDir, { recursive: true });
  }

  // Check for the existence of an attachment
  const fixturesDir = path.join(__dirname, './__fixtures__');
  const files = await readdir(fixturesDir);
  const match = files.find((file) =>
    file.toLowerCase().endsWith(extension.toLowerCase())
  );

  if (!match) {
    throw new Error(`No fixture file found with extension ${extension}`);
  }

  // Create the source path
  const srcPath = path.join(fixturesDir, match);

  // Create the filepath name with destination directory
  const testFileName = `${Date.now()}-${match}`;
  const destPath = path.join(uploadDir, testFileName);

  await copyFile(srcPath, destPath);
  const { size } = await stat(destPath);

  const attachment = await prismaTest.attachment.create({
    data: {
      entityType: entityType,
      entityId: entityId,
      fileName: testFileName,
      fileSize: size,
      fileType: extension,
      fileUrl: null,
      filePath: destPath,
      uploadedBy: userId,
      storageType: StorageType.LOCAL,
      organizationId: organizationId,
    },
  });

  return attachment;
}

export async function createTestAttachments(
  count: number,
  prismaTest: PrismaClient,
  testDescription: string,
  entityId: number,
  entityType: AttachmentEntityType,
  userId: number,
  extension: Extension,
  organizationId: number
) {
  const attachments = [];
  for (let i = 0; i < count; i++) {
    attachments.push(
      await createTestAttachment(
        prismaTest,
        testDescription,
        entityId,
        entityType,
        userId,
        extension,
        organizationId
      )
    );
  }

  return attachments;
}
