import { existsSync, mkdirSync, writeFileSync, statSync } from 'fs';
import path from 'path';
import {
  PrismaClient,
  AttachmentEntityType,
  StorageType,
} from '@prisma/client';

export async function createTestAttachment(
  prismaTest: PrismaClient,
  testDescription: string,
  entityId: number,
  entityType: AttachmentEntityType,
  userId: number
) {
  const uploadDir = path.join(__dirname, '../../src/uploads');
  if (!existsSync(uploadDir)) {
    mkdirSync(uploadDir, { recursive: true });
  }

  const testFileName = `${Date.now()}-test.txt`;
  const filePath = path.join(uploadDir, testFileName);

  writeFileSync(filePath, 'This is a test attachment');

  const attachment = await prismaTest.attachment.create({
    data: {
      entityType: entityType,
      entityId: entityId,
      fileName: testFileName,
      fileSize: statSync(filePath).size,
      fileType: 'Text',
      fileUrl: null,
      filePath: filePath,
      uploadedBy: userId,
      storageType: StorageType.LOCAL,
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
  userId: number
) {
  const attachments = [];
  for (let i = 0; i < count; i++) {
    attachments.push(
      await createTestAttachment(
        prismaTest,
        testDescription,
        entityId,
        entityType,
        userId
      )
    );
  }

  return attachments;
}
