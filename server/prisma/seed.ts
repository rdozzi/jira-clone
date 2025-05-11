import prisma from '../src/lib/prisma';
// import { seedUsers } from './seed/seedUsers';
// import { seedProjects } from './seed/seedProjects';
// import { seedBoards } from './seed/seedBoards';
// import { seedTickets } from './seed/seedTickets';
// import { seedComments } from './seed/seedComments';
// import { seedAttachments } from './seed/seedAttachments';
// import { seedLabels } from './seed/seedLabels';
// import { seedLabelsWithTickets } from './seed/seedLabelsWithTickets';
// import { seedActivityLog } from './seed/seedActivityLog';
import { seedProjectMember } from './seed/seedProjectMember';

async function main() {
  // const users = await seedUsers(prisma);
  // const projects = await seedProjects({ prisma, users });
  // const boards = await seedBoards({ prisma, projects });
  // const tickets = await seedTickets({ prisma, users, boards });
  // const labels = await seedLabels(prisma);

  // await seedUsers(prisma);
  // await seedProjects({ prisma, users });
  // await seedBoards({ prisma, projects });
  // await seedTickets({ prisma, users, boards });
  // await seedComments({
  //   prisma,
  //   tickets,
  //   users,
  // });
  // await seedAttachments(prisma);
  // await seedLabels(prisma);
  // await seedLabelsWithTickets({
  //   prisma,
  //   labels,
  //   tickets,
  // });
  // await seedActivityLog(prisma);
  await seedProjectMember(prisma);
}

main()
  .then(async () => {
    console.log('Seeding completed successfully.');
    await prisma.$disconnect();
    if (typeof process !== 'undefined') {
      process.exit(0);
    }
  })
  .catch(async (e) => {
    console.error('Error during seeding:', e);
    await prisma.$disconnect();
    if (typeof process !== 'undefined') {
      process.exit(1);
    }
  });
