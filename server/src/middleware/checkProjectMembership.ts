import { Response, NextFunction } from 'express';
import { CustomRequest } from '../types/CustomRequest';
import prisma from '../lib/prisma';

export async function checkProjectMembership(
  req: CustomRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId = req.user?.id;
    const userRole = req.user?.role;
    const ticketId = req.params.ticketId;
    const ticketIdNumber = parseInt(ticketId, 10);

    if (!userId) {
      res.status(403).json({ message: 'No User Id defined' });
      return;
    }

    // If the user is a SUPERADMIN, allow access to all tickets
    if (userRole === 'SUPERADMIN') {
      res.locals.userRole = userRole;
      return next();
    }

    const ticket = await prisma.ticket.findUnique({
      where: { id: ticketIdNumber },
      include: {
        board: { include: { project: true } },
      },
    });

    const projectId = ticket?.board.project.id;

    const member = await prisma.projectMember.findFirst({
      where: { projectId, userId: userId },
    });

    if (!member) {
      res.status(403).json({ message: 'Forbidden: Not a Project Member' });
      return;
    }

    res.locals.projectMember = member;
    next();
  } catch (error) {
    console.error('Auth Error:', error);
    res.status(500).json({ message: 'Server error during auth check' });
  }
}
