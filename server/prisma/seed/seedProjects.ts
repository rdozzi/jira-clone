import { PrismaClient, User } from '@prisma/client';

type SeedProjectsArgs = {
  prisma: PrismaClient;
  users: {
    user1: User;
    user2: User;
  };
};

export async function seedProjects({ prisma, users }: SeedProjectsArgs) {
  // Seed Projects
  const project1 = await prisma.project.upsert({
    where: { id: 1 },
    update: {},
    create: {
      name: 'Project1',
      description: 'Test project 1 for seeding',
      ownerId: users.user1.id,
      status: 'ACTIVE',
    },
  });
  const project2 = await prisma.project.upsert({
    where: { id: 2 },
    update: {},
    create: {
      name: 'Project2',
      description: 'Test project 2 for seeding',
      ownerId: users.user2.id,
      status: 'ARCHIVED',
    },
  });
  console.log(`Created projects: ${project1.name}, ${project2.name}`);

  return { project1, project2 };
}
