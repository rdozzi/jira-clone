import { describe, expect, afterAll, beforeAll, it } from '@jest/globals';
import request from 'supertest';

import { GlobalRole, User, Ticket } from '@prisma/client';
import { app } from '../../src/app';
import { prismaTest } from '../../src/lib/prismaTestClient';

import { resetTestDatabase } from '../../src/utilities/testUtilities/resetTestDatabase';
import { createUserProfile } from '../../src/utilities/testUtilities/createUserProfile';
import { createProject } from '../../src/utilities/testUtilities/createProject';
import { createBoard } from '../../src/utilities/testUtilities/createBoard';
import { createTicket } from '../../src/utilities/testUtilities/createTicket';
import { createComment } from '../../src/utilities/testUtilities/createComment';
import { generateJwtToken } from '../../src/utilities/testUtilities/generateJwtToken';

describe('Get all comments', () => {
  let token: string;
  let user: User;
  let ticket: Ticket;
  const testDescription = 'getAllComments';
  beforeAll(async () => {
    await prismaTest.$connect();
    await resetTestDatabase();
    user = await createUserProfile(
      prismaTest,
      testDescription,
      GlobalRole.ADMIN
    );
    token = generateJwtToken(user.id, user.globalRole);
    const project = await createProject(prismaTest, testDescription);
    const board = await createBoard(prismaTest, testDescription, project.id);
    ticket = await createTicket(prismaTest, testDescription, board.id, user.id);
    await createComment(prismaTest, testDescription, ticket.id, user.id);
    await createComment(prismaTest, testDescription, ticket.id, user.id);
  });
  afterAll(async () => {
    await prismaTest.$disconnect();
  });

  it('should get all comments', async () => {
    const res = await request(app)
      .get(`/api/comments`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.message).toEqual('Comments were fetched successfully');
    expect(res.body.data).toHaveLength(2);
  });
});
