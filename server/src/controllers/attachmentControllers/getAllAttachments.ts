import { Request, Response } from 'express';
import { PrismaClient, AttachmentEntityType } from '@prisma/client';

export async function getAllAttachments(
  req: Request,
  res: Response,
  prisma: PrismaClient
) {
  let whereClause:
    | { entityType?: AttachmentEntityType; entityId?: number }
    | undefined;
  const { entityType, entityId } = req.params;
  const parsedEntityId = parseInt(entityId, 10);
  const isValidId = Number.isInteger(parsedEntityId) && parsedEntityId > 0;
  const isValidEntity = Object.values(AttachmentEntityType).includes(
    entityType as AttachmentEntityType
  );

  if (entityType && entityId && isValidId && isValidEntity) {
    whereClause = {
      entityType: entityType as AttachmentEntityType,
      entityId: parseInt(entityId, 10),
    };
  } else if (entityType || entityId) {
    res
      .status(400)
      .json({ message: 'Both a valid entity type and id are required' });
  }

  try {
    const attachments = await prisma.attachment.findMany({
      where: whereClause,
    });

    return res.status(200).json(attachments);
  } catch (error) {
    console.error('Error fetching attachments: ', error);
    res.status(500).json({ error: 'Failed to fetch attachments' });
  }
}
