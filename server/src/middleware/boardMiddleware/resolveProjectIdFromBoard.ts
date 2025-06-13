import { Request, Response, NextFunction } from 'express';
import prisma from '../../lib/prisma';

export function resolveProjectIdFromBoard() {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const projectIdRaw = req.params.projectId || req.body.projectId;

      if (projectIdRaw) {
        const projectId = parseInt(projectIdRaw, 10);
        if (isNaN(projectId)) {
          res.status(400).json({ message: 'Invalid project ID' });
          return;
        }
        res.locals.projectId = projectId;
        next();
        return;
      }

      const boardIdRaw = req.params.boardId || req.body.boardId;
      const boardId = parseInt(boardIdRaw, 10);

      if (isNaN(boardId)) {
        res.status(400).json({ message: 'Invalid board ID' });
        return;
      }

      const board = await prisma.board.findUnique({
        where: { id: boardId },
      });

      res.locals.projectId = board?.projectId || null;
      next();
      return;
    } catch (error) {
      console.error('Error resolvi projectId from board:', error);
      next(error);
    }
  };
}
