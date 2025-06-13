import { PrismaClient } from '@prisma/client';

export async function getProjectIdByBoard(
  attachmentIdParsed: number,
  prisma: PrismaClient
) {
  try {
    const boardWithProject = await prisma.board.findUnique({
      where: { id: attachmentIdParsed },
      select: { projectId: true },
    });

    const projectId = boardWithProject?.projectId || null;

    return projectId;
  } catch (error) {
    console.error('Error fetching project Id:', error);
    throw error;
  }
}
