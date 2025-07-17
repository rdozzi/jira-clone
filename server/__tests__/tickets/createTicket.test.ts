import { describe, expect, afterAll, beforeAll, it } from '@jest/globals';
import request from 'supertest';

import {
  GlobalRole,
  User,
  ProjectRole,
  Status,
  Priority,
  Type,
  Board,
} from '@prisma/client';
import { app } from '../../src/app';
import { prismaTest } from '../../src/lib/prismaTestClient';

import { resetTestDatabase } from '../../src/utilities/testUtilities/resetTestDatabase';
import { createUserProfile } from '../../src/utilities/testUtilities/createUserProfile';
import { createProject } from '../../src/utilities/testUtilities/createProject';
import { createBoard } from '../../src/utilities/testUtilities/createBoard';
import { createProjectMember } from '../../src/utilities/testUtilities/createProjectMember';
import { generateJwtToken } from '../../src/utilities/testUtilities/generateJwtToken';

describe('Create a ticket', () => {
  let token: string;
  let user: User;
  let board: Board;
  const testDescription = 'createATicket';
  beforeAll(async () => {
    await prismaTest.$connect();
    await resetTestDatabase();
    user = await createUserProfile(
      prismaTest,
      testDescription,
      GlobalRole.USER
    );
    token = generateJwtToken(user.id, user.globalRole);
    const project = await createProject(prismaTest, testDescription, user.id);
    board = await createBoard(prismaTest, testDescription, project.id);
    await createProjectMember(
      prismaTest,
      project.id,
      user.id,
      ProjectRole.USER
    );
  });
  afterAll(async () => {
    await prismaTest.$disconnect();
  });

  it('should create a ticket', async () => {
    const res = await request(app)
      .post(`/api/tickets`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: `Title_${testDescription}`,
        description: `Description_${testDescription}`,
        status: Status.BACKLOG,
        priority: Priority.HIGH,
        type: Type.STORY,
        assigneeId: user.id,
        reporterId: user.id,
        boardId: board.id,
        dueDate: new Date('30 July 2025 17:00 UTC').toISOString(),
      });
    console.log(res.body);
    expect(res.status).toBe(201);
    expect(res.body).toEqual(
      expect.objectContaining({
        data: {
          id: expect.any(Number),
          title: expect.any(String),
          description: expect.any(String),
          status: expect.any(String),
          priority: expect.any(String),
          type: expect.any(String),
          assigneeId: expect.any(Number),
          reporterId: expect.any(Number),
          boardId: expect.any(Number),
          dueDate: expect.any(String),
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        },
        message: expect.any(String),
      })
    );
  });
});
