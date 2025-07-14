import { describe, expect, afterAll, beforeAll, it } from '@jest/globals';
import request from 'supertest';

import { GlobalRole, Project, ProjectRole, User } from '@prisma/client';
import { app } from '../../src/app';
import { prismaTest } from '../../src/lib/prismaTestClient';
import { createUserProfile } from '../../src/utilities/testUtilities/createUserProfile';
import { createProject } from '../../src/utilities/testUtilities/createProject';
import { createProjectMember } from '../../src/utilities/testUtilities/createProjectMember';
import { resetTestDatabase } from '../../src/utilities/testUtilities/resetTestDatabase';
import { generateJwtToken } from '../../src/utilities/testUtilities/generateJwtToken';

describe('Get user by project id', () => {
  let token: string;
  let user1: User;
  let user2: User;
  let project: Project;

  const testDescription = 'getUserByProjectId';
  beforeAll(async () => {
    await prismaTest.$connect();
    await resetTestDatabase();
    user1 = await createUserProfile(
      prismaTest,
      testDescription,
      GlobalRole.USER
    );
    user2 = await createUserProfile(
      prismaTest,
      testDescription,
      GlobalRole.ADMIN
    );
    token = generateJwtToken(user1.id, user1.globalRole);

    project = await createProject(prismaTest, testDescription);

    await createProjectMember(
      prismaTest,
      project.id,
      user1.id,
      ProjectRole.VIEWER
    );
    await createProjectMember(
      prismaTest,
      project.id,
      user2.id,
      ProjectRole.USER
    );
  });
  afterAll(async () => {
    await prismaTest.$disconnect();
  });

  it('Get users by project id', async () => {
    const res = await request(app)
      .get(`/api/users/${project.id}/project`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(2);
    expect(res.body.data).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: expect.any(Number),
          firstName: expect.any(String),
          lastName: expect.any(String),
          email: expect.any(String),
          globalRole: expect.any(String),
        }),
      ])
    );
  });
});
