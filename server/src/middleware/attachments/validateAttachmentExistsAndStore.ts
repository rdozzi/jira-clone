import { Request, Response, NextFunction } from 'express';
import { Attachment } from '@prisma/client';
import prisma from '../../lib/prisma';

export async function validateAttachmentExistsAndStore(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const { attachmentId } = req.params;
  const attachmentIdParsed = parseInt(attachmentId, 10);

  try {
    const attachment = await prisma.attachment.findUnique({
      where: { id: attachmentIdParsed },
    });

    if (!attachment) {
      res.status(404).json({ error: 'Attachment not found' });
      return;
    }

    // Attach the found attachment to the request object for further use
    res.locals.attachment = attachment as Attachment;

    next();
  } catch (error) {
    console.error('Middleware Error: ', error);
    res.status(500).json({ error: 'Failed to validate attachment' });
  }
}
