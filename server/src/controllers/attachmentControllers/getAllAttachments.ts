import { Request, Response } from 'express';
import { PrismaClient, AttachmentEntityType } from '@prisma/client';

export async function getAllAttachments(
  req: Request,
  res: Response,
  prisma: PrismaClient
) {
  const { entityType, entityId } = req.body;

  try {
    const whereClause =
      entityType && entityId
        ? {
            entityType: entityType as AttachmentEntityType,
            entityId: parseInt(entityId, 10),
          }
        : undefined;

    const attachments = await prisma.attachment.findMany({
      where: whereClause,
    });

    return res.status(200).json(attachments);
  } catch (error) {
    console.error('Error fetching attachments: ', error);
    res.status(500).json({ error: 'Failed to fetch attachments' });
  }
}
