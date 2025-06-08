// This will check if the entity referenced by id number exists in the database.

import { PrismaClient, AttachmentEntityType } from '@prisma/client';

export async function validateEntityAndId(
  entityType: AttachmentEntityType,
  entityId: number,
  prisma: PrismaClient
) {
  try {
    switch (entityType) {
      case 'TICKET':
        return await prisma.ticket.findUnique({ where: { id: entityId } });
      case 'COMMENT':
        return await prisma.comment.findUnique({ where: { id: entityId } });
      case 'BOARD':
        return await prisma.board.findUnique({ where: { id: entityId } });
      case 'PROJECT':
        return await prisma.project.findUnique({ where: { id: entityId } });
      case 'USER':
        return await prisma.user.findUnique({ where: { id: entityId } });
      default:
        throw new Error('Invalid entity type');
    }
  } catch (error) {
    console.error(
      `Error validating entity ${entityType} with ID ${entityId}:`,
      error
    );
    return null;
  }
}
