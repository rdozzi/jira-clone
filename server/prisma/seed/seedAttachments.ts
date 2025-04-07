import { PrismaClient } from '@prisma/client';
import { randomNumberGen } from '../../utility/randomNumberGen';

export async function seedAttachments(prisma: PrismaClient) {
  const attachment1 = await prisma.attachment.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      entityType: 'TICKET',
      entityId: 1,
      fileName: 'attachment1.txt',
      fileSize: 12345,
      fileType: '.txt',
      fileUrl: 'http://example.com/attachment1.txt',
      filePath: 'filepath_attachment1',
      uploadedBy: randomNumberGen(1, 2),
      storageType: 'LOCAL',
    },
  });

  const attachment2 = await prisma.attachment.upsert({
    where: { id: 2 },
    update: {},
    create: {
      id: 2,
      entityType: 'COMMENT',
      entityId: 2,
      fileName: 'attachment2.txt',
      fileSize: 67890,
      fileType: '.txt',
      fileUrl: 'http://example.com/attachment2.txt',
      filePath: 'filepath_attachment2',
      uploadedBy: randomNumberGen(1, 2),
      storageType: 'LOCAL',
    },
  });

  console.log(`Created Attachments: ${attachment1.id}, ${attachment2.id}`);

  return { attachment1, attachment2 };
}
