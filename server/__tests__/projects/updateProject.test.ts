import { describe, expect, afterAll, beforeAll, it } from '@jest/globals';
import request from 'supertest';

import { GlobalRole, Project, User, ProjectRole } from '@prisma/client';
import { app } from '../../src/app';
import { prismaTest } from '../../src/lib/prismaTestClient';
import { createUserProfile } from '../../src/utilities/testUtilities/createUserProfile';
import { createProject } from '../../src/utilities/testUtilities/createProject';
import { createProjectMember } from '../../src/utilities/testUtilities/createProjectMember';
import { resetTestDatabase } from '../../src/utilities/testUtilities/resetTestDatabase';
import { generateJwtToken } from '../../src/utilities/testUtilities/generateJwtToken';

describe('Update Project', () => {
  let token: string;
  let user: User;
  let project: Project;
  const testDescription = 'updateProject';
  beforeAll(async () => {
    await prismaTest.$connect();
    await resetTestDatabase();
    user = await createUserProfile(
      prismaTest,
      testDescription,
      GlobalRole.ADMIN
    );
    project = await createProject(prismaTest, testDescription, user.id);
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
      .patch(`/api/projects/${project.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: `Name_${testDescription}_UPDATE`,
        description: `Description_${testDescription}_UPDATE`,
      });
    expect(res.status).toBe(200);
    expect(res.body).toEqual(
      expect.objectContaining({
        data: expect.objectContaining({
          id: expect.any(Number),
          name: `Name_${testDescription}_UPDATE`,
          ownerId: expect.any(Number),
          description: `Description_${testDescription}_UPDATE`,
          status: expect.any(String),
          isPublic: expect.any(Boolean),
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        }),
        message: expect.any(String),
      })
    );
  });
});
