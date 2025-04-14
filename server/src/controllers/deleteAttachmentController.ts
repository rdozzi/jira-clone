import { Request, Response } from 'express';
import fs from 'fs/promises';
import path from 'path';
import { PrismaClient } from '@prisma/client';

export async function deleteAttachment(
  req: Request,
  res: Response,
  prisma: PrismaClient
): Promise<void> {
  console.log('Deleting attachment controller...');
  try {
    const attachment = req.attachment;
    const storageType = attachment.storageType;
    if (storageType === 'LOCAL') {
      const filePath = path.resolve(
        __dirname,
        '..',
        '..',
        'uploads',
        attachment.filePath
      );
      await fs.unlink(filePath);
    } else if (storageType === 'CLOUD') {
      // await saveToCloud.deleteFile(attachment.path);
      console.log('Deleting from cloud storage:', attachment.path);
      // Implement the logic to delete the file from cloud storage (Eventually!)
    }

    // Delete DB Record
    await prisma.attachment.delete({
      where: { id: attachment.id },
    });
    res.status(200).json({ message: 'Attachment deleted successfully' });
  } catch (error) {
    console.error('Error deleting attachment: ', error);
    res.status(500).json({ error: 'Failed to delete attachment' });
  }
}
