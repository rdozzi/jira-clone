import { Request, Response, NextFunction } from 'express';
import { AttachmentEntityType, PrismaClient, Attachment } from '@prisma/client';

export function resolveProjectIdForSingleDeletion(prisma: PrismaClient) {
  return async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    // For the single attachment deletion route, res.locals.attachment comes from validateAttachmentExistsAndStore
    const attachment: Attachment = res.locals.attachment;

    const entityId = attachment.entityId;
    const entityType = attachment.entityType;

    if (!entityId || isNaN(entityId)) {
      res.status(404).json({ message: 'Entity Id is not valid' });
      return;
    }

    if (!entityType) {
      res.status(404).json({ message: 'Entity type is not valid' });
      return;
    }

    try {
      let projectId: number | undefined;

      switch (entityType) {
        case AttachmentEntityType.COMMENT: {
          const comment = await prisma.comment.findFirst({
            where: { id: entityId },
            include: {
              ticket: {
                include: {
                  board: { select: { projectId: true } },
                },
              },
            },
          });
          projectId = comment?.ticket?.board?.projectId;
          break;
        }
        case AttachmentEntityType.TICKET: {
          const ticket = await prisma.ticket.findFirst({
            where: { id: entityId },
            include: {
              board: { select: { projectId: true } },
            },
          });
          projectId = ticket?.board?.projectId;
          break;
        }
        case AttachmentEntityType.BOARD: {
          const board = await prisma.board.findFirst({
            where: { id: entityId },
          });
          projectId = board?.projectId;
          break;
        }
        case AttachmentEntityType.PROJECT: {
          projectId = entityId;
          break;
        }
        default: {
          res
            .status(400)
            .json({ message: `Unsupported entity type: ${entityType}` });
          return;
        }
      }

      if (projectId === undefined) {
        res.status(404).json({ message: 'Project not found for given entity' });
        return;
      }

      res.locals.projectId = projectId;
      next();
      return;
    } catch (error) {
      console.error(
        `Error resolving projectId for ${entityType}:${entityId}`,
        error
      );
      res.status(500).json({
        message: 'Internal error resolving project association',
      });
    }
  };
}
