import { Response, NextFunction } from 'express';
import { CustomRequest } from '../types/CustomRequest';
import prisma from '../lib/prisma';

export async function validateAttachmentExists(
  req: CustomRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  const { id } = req.params;

  try {
    const attachment = await prisma.attachment.findUnique({
      where: { id: Number(id) },
    });

    if (!attachment) {
      res.status(404).json({ error: 'Attachment not found' });
      return;
    }

    // Attach the found attachment to the request object for further use
    req.attachment = attachment;

    next();
  } catch (error) {
    console.error('Middleware Error: ', error);
    res.status(500).json({ error: 'Failed to validate attachment' });
  }
}
