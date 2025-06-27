import { Prisma, PrismaClient, ProjectRole } from '@prisma/client';

export async function createProjectMember(
  prismaTest: PrismaClient | Prisma.TransactionClient,
  projectId: number,
  userId: number,
  projectRole: ProjectRole
) {
  const projectMember = await prismaTest.projectMember.findFirst({
    where: {
      projectId: projectId,
      userId: userId,
      projectRole: projectRole,
    },
  });

  if (projectMember) {
    return projectMember;
  } else {
    const projectMember = await prismaTest.projectMember.create({
      data: {
        projectId: projectId,
        userId: userId,
        projectRole: projectRole,
      },
    });

    return projectMember;
  }
}
