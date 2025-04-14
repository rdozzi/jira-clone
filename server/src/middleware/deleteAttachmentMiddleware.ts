import { Request, Response, NextFunction } from 'express';
import prisma from '../lib/prisma';

export async function validateAttachmentExists(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const { id } = req.params;

  console.log('Validate AttachmentExists', id);

  try {
    const attachment = await prisma.attachment.findUnique({
      where: { id: Number(id) },
    });

    console.log(attachment);

    if (!attachment) {
      return res.status(404).json({ error: 'Attachment not found' });
    }

    // Attach the found attachment to the request object for further use
    req.attachment = attachment;

    next();
  } catch (error) {
    console.error('Middleware Error: ', error);
    res.status(500).json({ error: 'Failed to validate attachment' });
  }
}
