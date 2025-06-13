import { PrismaClient } from '@prisma/client';

export async function getProjectIdByComment(
  attachmentIdParsed: number,
  prisma: PrismaClient
) {
  try {
    const commentWithProject = await prisma.comment.findUnique({
      where: { id: attachmentIdParsed },
      include: {
        ticket: { include: { board: { select: { projectId: true } } } },
      },
    });

    const projectId = commentWithProject?.ticket?.board?.projectId || null;

    return projectId;
  } catch (error) {
    console.error('Error fetching project Id:', error);
    throw error;
  }
}
