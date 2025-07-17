import { describe, expect, afterAll, beforeAll, it } from '@jest/globals';
import request from 'supertest';

import {
  Board,
  GlobalRole,
  Project,
  Ticket,
  User,
  ProjectRole,
} from '@prisma/client';
import { app } from '../../src/app';
import { prismaTest } from '../../src/lib/prismaTestClient';
import { createUserProfile } from '../../src/utilities/testUtilities/createUserProfile';
import { createProject } from '../../src/utilities/testUtilities/createProject';
import { createBoard } from '../../src/utilities/testUtilities/createBoard';
import { createTicket } from '../../src/utilities/testUtilities/createTicket';
import { createProjectMember } from '../../src/utilities/testUtilities/createProjectMember';
import { resetTestDatabase } from '../../src/utilities/testUtilities/resetTestDatabase';
import { generateJwtToken } from '../../src/utilities/testUtilities/generateJwtToken';

describe('Update Ticket', () => {
  let token: string;
  let user: User;
  let project: Project;
  let board: Board;
  let ticket: Ticket;

  const testDescription = 'updateTicket';
  beforeAll(async () => {
    await prismaTest.$connect();
    await resetTestDatabase();
    user = await createUserProfile(
      prismaTest,
      testDescription,
      GlobalRole.ADMIN
    );
    project = await createProject(prismaTest, testDescription, user.id);
    board = await createBoard(prismaTest, testDescription, project.id);
    ticket = await createTicket(prismaTest, testDescription, board.id, user.id);
    await createProjectMember(
      prismaTest,
      project.id,
      user.id,
      ProjectRole.USER
    );
    token = generateJwtToken(user.id, user.globalRole);
  });
  afterAll(async () => {
    await prismaTest.$disconnect();
  });

  it("updates the user's information", async () => {
    const res = await request(app)
      .patch(`/api/tickets/${ticket.id}/update`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: `${testDescription}_TITLE_UPDATE`,
        description: `${testDescription}_DESCRIPTION_UPDATE`,
      });
    expect(res.status).toBe(200);
    expect(res.body).toEqual(
      expect.objectContaining({
        data: expect.objectContaining({
          id: expect.any(Number),
          title: `${testDescription}_TITLE_UPDATE`,
          description: `${testDescription}_DESCRIPTION_UPDATE`,
          status: expect.any(String),
          priority: expect.any(String),
          type: expect.any(String),
          assigneeId: expect.any(Number),
          reporterId: expect.any(Number),
          boardId: expect.any(Number),
          dueDate: null,
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        }),
        message: expect.any(String),
      })
    );
  });
});
