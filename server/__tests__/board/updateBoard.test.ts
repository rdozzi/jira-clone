import { describe, expect, afterAll, beforeAll, it } from '@jest/globals';
import request from 'supertest';

import { Board, GlobalRole, Project, User, ProjectRole } from '@prisma/client';
import { app } from '../../src/app';
import { prismaTest } from '../../src/lib/prismaTestClient';
import { createUserProfile } from '../../src/utilities/testUtilities/createUserProfile';
import { createProject } from '../../src/utilities/testUtilities/createProject';
import { createBoard } from '../../src/utilities/testUtilities/createBoard';
import { createProjectMember } from '../../src/utilities/testUtilities/createProjectMember';
import { resetTestDatabase } from '../../src/utilities/testUtilities/resetTestDatabase';
import { generateJwtToken } from '../../src/utilities/testUtilities/generateJwtToken';

describe('Update Board', () => {
  let token: string;
  let user: User;
  let project: Project;
  let board: Board;

  const testDescription = 'updateBoard';
  beforeAll(async () => {
    await prismaTest.$connect();
    await resetTestDatabase();
    user = await createUserProfile(
      prismaTest,
      testDescription,
      GlobalRole.ADMIN
    );
    project = await createProject(prismaTest, testDescription);
    board = await createBoard(prismaTest, testDescription, project.id);
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

  it("updates the board's information", async () => {
    const res = await request(app)
      .patch(`/api/boards/${board.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: `Name_${testDescription}_UPDATE`,
      });
    expect(res.status).toBe(200);
    expect(res.body).toEqual(
      expect.objectContaining({
        data: expect.objectContaining({
          id: expect.any(Number),
          name: `Name_${testDescription}_UPDATE`,
          projectId: expect.any(Number),
          description: expect.any(String),
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        }),
        message: expect.any(String),
      })
    );
  });
});
