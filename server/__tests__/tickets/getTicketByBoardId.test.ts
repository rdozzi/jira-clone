import { describe, expect, afterAll, beforeAll, it } from '@jest/globals';
import request from 'supertest';

import { User, GlobalRole, ProjectRole, Board } from '@prisma/client';
import { app } from '../../src/app';
import { prismaTest } from '../../src/lib/prismaTestClient';
import { createUserProfile } from '../../src/utilities/testUtilities/createUserProfile';
import { createProject } from '../../src/utilities/testUtilities/createProject';
import { createBoard } from '../../src/utilities/testUtilities/createBoard';
import { createTicket } from '../../src/utilities/testUtilities/createTicket';
import { createProjectMember } from '../../src/utilities/testUtilities/createProjectMember';
import { resetTestDatabase } from '../../src/utilities/testUtilities/resetTestDatabase';
import { generateJwtToken } from '../../src/utilities/testUtilities/generateJwtToken';

describe('Get ticket by board id', () => {
  let token: string;
  let user: User;
  let board: Board;
  const testDescription = 'getTicketByBoardId';
  beforeAll(async () => {
    await prismaTest.$connect();
    await resetTestDatabase();
    user = await createUserProfile(
      prismaTest,
      `${testDescription}_1`,
      GlobalRole.USER
    );
    const project = await createProject(prismaTest, testDescription, user.id);
    board = await createBoard(prismaTest, testDescription, project.id);
    await createTicket(prismaTest, `${testDescription}_1`, board.id, user.id);
    await createTicket(prismaTest, `${testDescription}_2`, board.id, user.id);
    await createTicket(prismaTest, `${testDescription}_3`, board.id, user.id);
    await createProjectMember(
      prismaTest,
      project.id,
      user.id,
      ProjectRole.VIEWER
    );
    token = generateJwtToken(user.id, user.globalRole);
  });
  afterAll(async () => {
    await prismaTest.$disconnect();
  });

  it('should get all tickets by board id', async () => {
    const res = await request(app)
      .get(`/api/tickets/${board.id}/board`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Tickets fetched successfully');
    expect(res.body.data).toHaveLength(3);
  });
});
