import { PrismaClient } from '@prisma/client';

export async function findManyQueryService(
  prisma: PrismaClient,
  resource: string,
  organizationId: number,
  recordId: number
) {
  const resourceEdited = resource.toUpperCase();

  switch (resourceEdited) {
    case 'ORGANIZATION':
      return await prisma.organization.findMany({
        where: {
          ...(recordId && { id: recordId }),
        },
      });
    case 'PROJECT':
      return await prisma.project.findMany({
        where: {
          organizationId: organizationId,
          ...(recordId && { id: recordId }),
        },
      });
    case 'BOARD':
      return await prisma.board.findMany({
        where: {
          organizationId: organizationId,
          ...(recordId && { id: recordId }),
        },
      });
    case 'TICKET':
      return await prisma.ticket.findMany({
        where: {
          organizationId: organizationId,
          ...(recordId && { id: recordId }),
        },
      });
    case 'COMMENT':
      return await prisma.comment.findMany({
        where: {
          organizationId: organizationId,
          ...(recordId && { id: recordId }),
        },
      });
    case 'USER':
      return await prisma.user.findMany({
        where: {
          organizationId: organizationId,
          ...(recordId && { id: recordId }),
        },
      });
    case 'ATTACHMENT':
      return await prisma.attachment.findMany({
        where: {
          organizationId: organizationId,
          ...(recordId && { id: recordId }),
        },
      });
    case 'LABEL':
      return await prisma.label.findMany({
        where: {
          organizationId: organizationId,
          ...(recordId && { id: recordId }),
        },
      });
    case 'ACTIVITYLOG':
      return await prisma.activityLog.findMany({
        where: {
          organizationId: organizationId,
          ...(recordId && { id: recordId }),
        },
      });
    case 'BANNEDEMAIL':
      return await prisma.bannedEmail.findMany({
        where: {
          organizationId: organizationId,
          ...(recordId && { id: recordId }),
        },
      });
    case 'TICKETLABEL':
      return await prisma.activityLog.findMany({
        where: {
          organizationId: organizationId,
          ...(recordId && { id: recordId }),
        },
      });
    case 'PROJECTMEMBER':
      return await prisma.activityLog.findMany({
        where: {
          organizationId: organizationId,
          ...(recordId && { id: recordId }),
        },
      });
    default:
      throw new Error('Invalid resource provided');
  }
}
