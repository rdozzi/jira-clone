import { describe, expect, afterAll, beforeAll, it } from '@jest/globals';
import request from 'supertest';

import { User, GlobalRole, Ticket, ProjectRole } from '@prisma/client';
import { app } from '../../src/app';
import { prismaTest } from '../../src/lib/prismaTestClient';
import { createUserProfile } from '../../src/utilities/testUtilities/createUserProfile';
import { createProject } from '../../src/utilities/testUtilities/createProject';
import { createBoard } from '../../src/utilities/testUtilities/createBoard';
import { createTicket } from '../../src/utilities/testUtilities/createTicket';
import { createProjectMember } from '../../src/utilities/testUtilities/createProjectMember';
import { resetTestDatabase } from '../../src/utilities/testUtilities/resetTestDatabase';
import { generateJwtToken } from '../../src/utilities/testUtilities/generateJwtToken';

describe('Get all tickets', () => {
  let token: string;
  let user: User;
  let ticket1: Ticket;
  const testDescription = 'getAllTickets';
  beforeAll(async () => {
    await prismaTest.$connect();
    await resetTestDatabase();
    user = await createUserProfile(
      prismaTest,
      `${testDescription}_1`,
      GlobalRole.ADMIN
    );
    const project = await createProject(prismaTest, testDescription, user.id);
    const board = await createBoard(prismaTest, testDescription, project.id);
    ticket1 = await createTicket(
      prismaTest,
      `${testDescription}_1`,
      board.id,
      user.id
    );
    await createTicket(prismaTest, `${testDescription}_2`, board.id, user.id);
    await createTicket(prismaTest, `${testDescription}_3`, board.id, user.id);
    await createProjectMember(
      prismaTest,
      project.id,
      user.id,
      ProjectRole.ADMIN
    );
    token = generateJwtToken(user.id, user.globalRole);
  });
  afterAll(async () => {
    await prismaTest.$disconnect();
  });

  it('should get all tickets', async () => {
    const res = await request(app)
      .get(`/api/tickets`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Tickets fetched successfully');
    expect(res.body.data).toHaveLength(3);
  });
  it('should get a ticket by its id', async () => {
    const res = await request(app)
      .get(`/api/tickets/${ticket1.id}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Ticket fetched successfully');
    expect(res.body.data).toEqual({
      id: expect.any(Number),
      title: expect.any(String),
      description: expect.any(String),
      status: expect.any(String),
      priority: expect.any(String),
      type: expect.any(String),
      assigneeId: expect.any(Number),
      reporterId: expect.any(Number),
      boardId: expect.any(Number),
      dueDate: null,
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
    });
  });
  it('should get a ticket by assignee id', async () => {
    const res = await request(app)
      // .get(`/api/tickets/${user.id}/assigneeId`)
      .get(`/api/tickets`)
      .query({ assigneeId: user.id })
      .set('Authorization', `Bearer ${token}`);
    console.log(res.body);
    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Tickets fetched successfully');
    expect(res.body.data).toHaveLength(3);
  });
});
