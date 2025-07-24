import { Prisma, PrismaClient, ProjectRole } from '@prisma/client';

export async function createProjectMember(
  prismaTest: PrismaClient | Prisma.TransactionClient,
  projectId: number,
  userId: number,
  projectRole: ProjectRole,
  organizationId: number
) {
  const projectMember = await prismaTest.projectMember.create({
    data: {
      projectId: projectId,
      userId: userId,
      projectRole: projectRole,
      organizationId: organizationId,
    },
  });

  return projectMember;
}
