import { PrismaClient } from '@prisma/client';
import { hashPassword } from '../src/password';

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await hashPassword('seedPassword123');

  // Seed Users
  const user1 = await prisma.user.upsert({
    where: { email: 'user1@example.com' },
    update: {},
    create: {
      email: 'user1@example.com',
      first_name: 'Bob',
      last_name: 'Newhart',
      passwordHash: hashedPassword,
      role: 'USER',
    },
  });

  const user2 = await prisma.user.upsert({
    where: { email: 'user2@example.com' },
    update: {},
    create: {
      email: 'user2@example.com',
      first_name: 'Sally',
      last_name: 'Fields',
      passwordHash: hashedPassword,
      role: 'USER',
    },
  });

  console.log(
    `Created users: ${user1.first_name} ${user1.last_name} , ${user2.first_name} ${user2.last_name}`
  );

  // Seed Projects
  const project1 = await prisma.project.upsert({
    where: { id: 1 },
    update: {},
    create: {
      name: 'Project1',
      description: 'Test project 1 for seeding',
      ownerId: user1.id,
      status: 'ACTIVE',
    },
  });

  const project2 = await prisma.project.upsert({
    where: { id: 2 },
    update: {},
    create: {
      name: 'Project2',
      description: 'Test project 2 for seeding',
      ownerId: user2.id,
      status: 'ARCHIVED',
    },
  });

  console.log(`Created users: ${project1.name}, ${project2.name}`);

  // Seed Boards
  const board1 = await prisma.board.upsert({
    where: { id: 1 },
    update: { description: 'This is a description for board1' },
    create: {
      name: 'board1',
      projectId: project1.id,
      description: 'This is a description for board1',
    },
  });

  const board2 = await prisma.board.upsert({
    where: { id: 2 },
    update: { description: 'This is a description for board2' },
    create: {
      name: 'board2',
      projectId: project2.id,
      description: 'This is a description for board2',
    },
  });

  console.log(`Created boards: ${board1.name}, ${board2.name}`);

  //Seed Tickets
  const ticket1 = await prisma.ticket.upsert({
    where: { id: 1 },
    update: {},
    create: {
      title: 'ticket1',
      description: 'Ticket 1 used for seeding',
      status: 'BACKLOG',
      priority: 'HIGH',
      type: 'BUG',
      assigneeId: user1.id,
      reporterId: user2.id,
      boardId: board1.id,
    },
  });
  const ticket2 = await prisma.ticket.upsert({
    where: { id: 2 },
    update: {},
    create: {
      title: 'ticket2',
      description: 'Ticket 2 used for seeding',
      status: 'IN_PROGRESS',
      priority: 'MEDIUM',
      type: 'TASK',
      assigneeId: user2.id,
      reporterId: user1.id,
      boardId: board2.id,
    },
  });

  console.log(`Created Tickets: ${ticket1.title}, ${ticket2.title}`);

  //Seed Comments

  const comment1 = await prisma.comment.upsert({
    where: { id: 1 },
    update: {},
    create: {
      ticketId: ticket1.id,
      authorId: user1.id,
      content: 'Content for comment 1',
    },
  });

  const comment2 = await prisma.comment.upsert({
    where: { id: 2 },
    update: {},
    create: {
      ticketId: ticket2.id,
      authorId: user2.id,
      content: 'Content for comment 2',
    },
  });

  console.log(`Created Comments: ${comment1.content}, ${comment2.content}`);

  //Seed Attachments
  const attachment1 = await prisma.attachment.upsert({
    where: { id: 1 },
    update: {},
    create: {
      ticketId: ticket1.id,
      filePath: 'filepath_attachment1',
      uploadedBy: user1.id,
    },
  });

  const attachment2 = await prisma.attachment.upsert({
    where: { id: 2 },
    update: {},
    create: {
      ticketId: ticket2.id,
      filePath: 'filepath_attachment2',
      uploadedBy: user2.id,
    },
  });

  console.log(`Created Attachments: ${attachment1.id}, ${attachment2.id}`);

  //Seed Labels
  const label1 = await prisma.label.upsert({
    where: { id: 1 },
    update: {},
    create: {
      name: 'Urgent',
      color: '#FF0000',
    },
  });

  const label2 = await prisma.label.upsert({
    where: { id: 2 },
    update: {},
    create: {
      name: 'Feature',
      color: '#0000FF',
    },
  });
  console.log(`Created Labels: ${label1.name}, ${label2.name}`);

  //Associate Labels with Tickets
  await prisma.ticketLabel.createMany({
    data: [
      { ticketId: ticket1.id, labelId: label1.id },
      { ticketId: ticket1.id, labelId: label2.id },
    ],
  });

  console.log('Associated labels with tickets');

  //Seed Activity Log
  await prisma.activityLog.upsert({
    where: { id: 1 },
    update: {},
    create: {
      userId: 1,
      action: 'Seed database example action',
      targetId: 2,
      targetType: 'Seed database example target',
    },
  });
}

main()
  .catch((e) => {
    console.log(e);
    prisma.$disconnect();
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect();
    process.exit(1);
  });
