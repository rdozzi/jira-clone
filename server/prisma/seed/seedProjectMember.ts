import { PrismaClient, ProjectRole } from '@prisma/client';
import { logSeedUtility } from '../../src/utilities/logSeedUtility';

export async function seedProjectMember(prisma: PrismaClient) {
  const users = await prisma.user.findMany({
    where: { deletedAt: null },
  });

  const projects = await prisma.project.findMany();

  console.log('users', users);
  console.log('projects', projects);

  const modelName = 'ProjectMember';
  const seeds = users.map((user) => ({
    id: user.id,
  }));

  logSeedUtility({ seeds, modelName, prisma });

  // Seed Project Members
  const projectMembers = [
    {
      userId: users[2].id,
      projectId: projects[0].id,
      role: 'ADMIN' as ProjectRole, // GUEST Project
    },
    {
      userId: users[0].id,
      projectId: projects[1].id,
      role: 'VIEWER' as ProjectRole, // USER Project
    },
    {
      userId: users[1].id,
      projectId: projects[1].id,
      role: 'USER' as ProjectRole, // USER Project
    },
    {
      userId: users[3].id,
      projectId: projects[1].id,
      role: 'ADMIN' as ProjectRole, // USER Project
    },
  ];

  await prisma.projectMember.createMany({
    data: projectMembers,
  });
}
