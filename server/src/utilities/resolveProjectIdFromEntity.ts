import prisma from '../lib/prisma';

type Resolver = (id: number) => Promise<number | null>;

const entityResolvers: Record<string, Resolver> = {
  TICKET: async (entityId) => {
    const ticket = await prisma.ticket.findUnique({
      where: { id: entityId },
      include: { board: { select: { projectId: true } } },
    });
    return ticket?.board?.projectId || null;
  },
  COMMENT: async (entityId) => {
    const comment = await prisma.comment.findUnique({
      where: { id: entityId },
      include: {
        ticket: { select: { board: { select: { projectId: true } } } },
      },
    });

    return comment?.ticket?.board?.projectId || null;
  },
  BOARD: async (entityId) => {
    const board = await prisma.board.findUnique({
      where: { id: entityId },
    });

    return board?.projectId || null;
  },
};

export async function resolveProjectIdFromEntity(
  entityType: string,
  entityId: number
): Promise<number | null> {
  const resolver = entityResolvers[entityType];
  if (!resolver) {
    throw new Error(`Unsupported entit type: ${entityType}`);
  }
  try {
    return await resolver(entityId);
  } catch (error) {
    console.error(`Error resolving projectId for ${entityType}:`, error);
    return null;
  }
}
