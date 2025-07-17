import { describe, expect, afterAll, beforeAll, it } from '@jest/globals';
import request from 'supertest';

import { GlobalRole, User, ProjectRole, Project } from '@prisma/client';
import { app } from '../../src/app';
import { prismaTest } from '../../src/lib/prismaTestClient';

import { resetTestDatabase } from '../../src/utilities/testUtilities/resetTestDatabase';
import { createUserProfile } from '../../src/utilities/testUtilities/createUserProfile';
import { createProject } from '../../src/utilities/testUtilities/createProject';
import { createProjectMember } from '../../src/utilities/testUtilities/createProjectMember';
import { generateJwtToken } from '../../src/utilities/testUtilities/generateJwtToken';

describe('Create a board', () => {
  let token: string;
  let user: User;
  let project: Project;
  const testDescription = 'createABoard';
  beforeAll(async () => {
    await prismaTest.$connect();
    await resetTestDatabase();
    user = await createUserProfile(
      prismaTest,
      testDescription,
      GlobalRole.USER
    );
    token = generateJwtToken(user.id, user.globalRole);
    project = await createProject(prismaTest, testDescription);
    await createProjectMember(
      prismaTest,
      project.id,
      user.id,
      ProjectRole.ADMIN
    );
  });
  afterAll(async () => {
    await prismaTest.$disconnect();
  });

  it('should create a board', async () => {
    const res = await request(app)
      .post(`/api/boards`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: `Name_${testDescription}`,
        description: `Description_${testDescription}`,
        projectId: project.id,
      });
    console.log(res.body);
    expect(res.status).toBe(200);
    expect(res.body).toEqual(
      expect.objectContaining({
        data: {
          id: expect.any(Number),
          name: expect.any(String),
          projectId: expect.any(Number),
          description: expect.any(String),
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        },
        message: expect.any(String),
      })
    );
  });
});
