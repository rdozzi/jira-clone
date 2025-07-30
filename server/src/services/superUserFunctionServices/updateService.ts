import { PrismaClient } from '@prisma/client';
import { Response } from 'express';
import {
  CreateBoardBody,
  CreateCommentBody,
  CreateProjectBody,
  CreateTicketBody,
} from '../../types/CreateBody';

type BodyType =
  | Partial<CreateProjectBody>
  | Partial<CreateBoardBody>
  | Partial<CreateTicketBody>
  | Partial<CreateCommentBody>;

export async function updateService(
  prisma: PrismaClient,
  resource: string,
  organizationId: number,
  recordId: number,
  body: BodyType,
  res: Response
) {
  try {
    const resourceEdited = resource.toUpperCase();

    switch (resourceEdited) {
      case 'PROJECT':
        return await prisma.project.update({
          where: { id: recordId, organizationId: organizationId },
          data: body as Partial<CreateProjectBody>,
        });
      case 'BOARD':
        return await prisma.board.update({
          where: { id: recordId, organizationId: organizationId },
          data: body as Partial<CreateBoardBody>,
        });
      case 'TICKET':
        return await prisma.ticket.update({
          where: { id: recordId, organizationId: organizationId },
          data: body as Partial<CreateTicketBody>,
        });
      case 'COMMENT':
        return await prisma.comment.update({
          where: { id: recordId, organizationId: organizationId },
          data: body as Partial<CreateCommentBody>,
        });
      default:
        throw new Error('Selected resource is not available for creation.');
    }
  } catch (error) {
    console.error('Error create resource:', error);
    res.status(400).json({ error: 'Could not create resource' });
    return;
  }
}
