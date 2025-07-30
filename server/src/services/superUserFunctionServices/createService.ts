import { PrismaClient } from '@prisma/client';
import { Response } from 'express';
import {
  CreateBoardBody,
  CreateCommentBody,
  CreateProjectBody,
  CreateTicketBody,
} from '../../types/CreateBody';

type BodyType =
  | CreateProjectBody
  | CreateBoardBody
  | CreateTicketBody
  | CreateCommentBody;

export async function createService(
  prisma: PrismaClient,
  resource: string,
  body: BodyType,
  res: Response
) {
  try {
    const resourceEdited = resource.toUpperCase();

    switch (resourceEdited) {
      case 'PROJECT':
        return await prisma.project.create({ data: body as CreateProjectBody });
      case 'BOARD':
        return await prisma.board.create({ data: body as CreateBoardBody });
      case 'TICKET':
        return await prisma.ticket.create({ data: body as CreateTicketBody });
      case 'COMMENT':
        return await prisma.comment.create({ data: body as CreateCommentBody });
      default:
        throw new Error('Selected resource is not available for creation.');
        return;
    }
  } catch (error) {
    console.error('Error create resource:', error);
    res.status(400).json({ error: 'Could not create resource' });
    return;
  }
}
