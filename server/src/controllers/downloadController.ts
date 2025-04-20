import { Request, Response } from 'express';
import path from 'path';
import { getSignedUrl } from '../utilities/getSignedUrl';
import { PrismaClient } from '@prisma/client';

export async function downloadSingleAttachment(
  req: Request,
  res: Response,
  prisma: PrismaClient
) {
  const attachmentId = Number(req.params.id);
  try {
    const attachment = await prisma.attachment.findUnique({
      where: { id: attachmentId },
    });

    if (!attachment) {
      return res.status(404).json({ error: 'Attachment not found' });
    }

    if (attachment.storageType === 'LOCAL') {
      const filePath = path.resolve(attachment.filePath || '');
      return res.download(filePath, attachment.fileName);
    } else if (attachment.storageType === 'CLOUD') {
      const signedUrl = await getSignedUrl(attachment);
      return res.redirect(signedUrl);
    } else {
      res.status(400).json({ error: 'Invalid storage type' });
    }
  } catch (error) {
    console.error('Error downloading attachment: ', error);
    res.status(500).json({ error: 'Failed to download attachment' });
  }
}
