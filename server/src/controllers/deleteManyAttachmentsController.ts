import { Request, Response } from 'express';
import path from 'path';
import fs from 'fs/promises';
import { PrismaClient } from '@prisma/client';

export async function deleteManyAttachments(
  req: Request,
  res: Response,
  prisma: PrismaClient
): Promise<void> {
  const { ids } = req.body;

  if (!Array.isArray(ids) || ids.length === 0) {
    return res
      .status(400)
      .json({ error: 'Invalid request: No attachments Ids provided' });
  }

  try {
    const attachments = await prisma.attachment.findMany({
      where: {
        id: {
          in: ids,
        },
      },
    });

    for (const attachment of attachments) {
      try {
        if (attachment.storageType === 'LOCAL') {
          const filePath = path.resolve(attachment.filePath || '');
          await fs.unlink(filePath);
        } else if (attachment.storageType === 'CLOUD') {
          // await saveToCloud.deleteFile(attachment.path);
          console.log('Deleting from cloud storage:', attachment.fileUrl);
        }
      } catch (error) {
        console.error(
          `Failed to delete file for attachment ${attachment.filePath}:`,
          error
        );
      }
    }
    await prisma.attachment.deleteMany({
      where: {
        id: {
          in: ids,
        },
      },
    });
    res.status(200).json({ message: 'Attachments deleted successfully' });
  } catch (error) {
    console.error('Error deleting attachments: ', error);
    res.status(500).json({ error: 'Failed to delete attachments' });
  }
}
