import { PrismaClient } from '@prisma/client';

export async function getProjectIdByTicket(
  attachmentIdParsed: number,
  prisma: PrismaClient
) {
  try {
    const ticketWithProject = await prisma.ticket.findUnique({
      where: { id: attachmentIdParsed },
      include: { board: { select: { projectId: true } } },
    });

    const projectId = ticketWithProject?.board?.projectId || null;

    return projectId;
  } catch (error) {
    console.error('Error fetching project Id:', error);
    throw error;
  }
}
