import { describe, expect, afterAll, beforeAll, it } from '@jest/globals';
import request from 'supertest';

import {
  User,
  OrganizationRole,
  Organization,
  ProjectRole,
  Project,
  Board,
} from '@prisma/client';
import { app } from '../../src/app';
import { prismaTest } from '../../src/lib/prismaTestClient';
import { createOrganization } from '../../src/utilities/testUtilities/createOrganization';
import { createUserProfile } from '../../src/utilities/testUtilities/createUserProfile';
import { createProject } from '../../src/utilities/testUtilities/createProject';
import { createBoard } from '../../src/utilities/testUtilities/createBoard';
import { createProjectMember } from '../../src/utilities/testUtilities/createProjectMember';
import { resetTestDatabase } from '../../src/utilities/testUtilities/resetTestDatabase';
import { generateJwtToken } from '../../src/utilities/testUtilities/generateJwtToken';

describe('Get boards', () => {
  let token: string;
  let user: User;
  let project: Project;
  let board: Board;
  let organization: Organization;
  const testDescription = 'getBoardById';
  beforeAll(async () => {
    await prismaTest.$connect();
    await resetTestDatabase();
    organization = await createOrganization(prismaTest, testDescription);
    user = await createUserProfile(
      prismaTest,
      `${testDescription}_1`,
      OrganizationRole.ADMIN,
      organization.id
    );
    token = generateJwtToken(
      user.id,
      user.globalRole,
      user.organizationId,
      user.organizationRole
    );
    project = await createProject(
      prismaTest,
      testDescription,
      user.id,
      organization.id
    );
    board = await createBoard(
      prismaTest,
      `${testDescription}_1`,
      project.id,
      organization.id
    );
    await createProjectMember(
      prismaTest,
      project.id,
      user.id,
      ProjectRole.ADMIN,
      organization.id
    );
  });
  afterAll(async () => {
    await prismaTest.$disconnect();
  });

  it('should get the board by the board id', async () => {
    const res = await request(app)
      .get(`/api/boards/${board.id}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Board fetched successfully');
    expect(res.body.data).toEqual({
      id: expect.any(Number),
      name: `Board_${testDescription}_1`,
      projectId: expect.any(Number),
      description: expect.any(String),
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
      organizationId: expect.any(Number),
    });
  });
});
