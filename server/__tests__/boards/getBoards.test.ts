import { describe, expect, afterAll, beforeAll, it } from '@jest/globals';
import request from 'supertest';

import { User, GlobalRole, Board, ProjectRole } from '@prisma/client';
import { app } from '../../src/app';
import { prismaTest } from '../../src/lib/prismaTestClient';
import { createUserProfile } from '../../src/utilities/testUtilities/createUserProfile';
import { createProject } from '../../src/utilities/testUtilities/createProject';
import { createBoard } from '../../src/utilities/testUtilities/createBoard';
import { createProjectMember } from '../../src/utilities/testUtilities/createProjectMember';
import { resetTestDatabase } from '../../src/utilities/testUtilities/resetTestDatabase';
import { generateJwtToken } from '../../src/utilities/testUtilities/generateJwtToken';

describe('Get boards', () => {
  let token: string;
  let user: User;
  let board1: Board;
  // let board2: Board;
  // let board3: Board;
  const testDescription = 'getBoards';
  beforeAll(async () => {
    await prismaTest.$connect();
    await resetTestDatabase();
    user = await createUserProfile(
      prismaTest,
      `${testDescription}_1`,
      GlobalRole.ADMIN
    );
    const project = await createProject(prismaTest, testDescription);
    board1 = await createBoard(prismaTest, `${testDescription}_1`, project.id);
    await createBoard(prismaTest, `${testDescription}_2`, project.id);
    await createBoard(prismaTest, `${testDescription}_3`, project.id);
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

  it('should get all boards', async () => {
    const res = await request(app)
      .get(`/api/boards`)
      .set('Authorization', `Bearer ${token}`);
    console.log(res.body);
    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Boards fetched successfully');
    expect(res.body.data).toHaveLength(3);
  });
  it('should return a single board by id', async () => {
    const res = await request(app)
      .get(`/api/boards`)
      .query({ boardId: board1.id })
      .set('Authorization', `Bearer ${token}`);
    console.log(res.body);
    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Board fetched successfully');
    expect(res.body.data).toBeInstanceOf(Object);
  });
});
