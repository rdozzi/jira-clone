import { PrismaClient } from '@prisma/client';

export async function getOldRecordService(
  prisma: PrismaClient,
  resource: string,
  organizationId: number,

  recordId: number
) {
  const resourceEdited = resource.toUpperCase();

  switch (resourceEdited) {
    case 'PROJECT':
      return await prisma.project.findUnique({
        where: { id: recordId, organizationId: organizationId },
      });
    case 'BOARD':
      return await prisma.board.findUnique({
        where: {
          id: recordId,
          organizationId: organizationId,
        },
      });
    case 'TICKET':
      return await prisma.ticket.findUnique({
        where: {
          id: recordId,
          organizationId: organizationId,
        },
      });
    case 'COMMENT':
      return await prisma.comment.findUnique({
        where: {
          id: recordId,
          organizationId: organizationId,
        },
      });
    default:
      throw new Error('Invalid resource provided');
  }
}
