import { describe, expect, afterAll, beforeAll, it } from '@jest/globals';
import request from 'supertest';

import { GlobalRole, User, Project, ProjectRole } from '@prisma/client';
import { app } from '../../src/app';
import { prismaTest } from '../../src/lib/prismaTestClient';
import { createUserProfile } from '../../src/utilities/testUtilities/createUserProfile';
import { createProject } from '../../src/utilities/testUtilities/createProject';
import { createProjectMember } from '../../src/utilities/testUtilities/createProjectMember';
import { resetTestDatabase } from '../../src/utilities/testUtilities/resetTestDatabase';
import { generateJwtToken } from '../../src/utilities/testUtilities/generateJwtToken';

describe('Update project member role', () => {
  let token: string;
  let user1: User;
  let user2: User;
  let project: Project;
  const testDescription = 'Update project member role';
  beforeAll(async () => {
    await prismaTest.$connect();
    await resetTestDatabase();
    user1 = await createUserProfile(
      prismaTest,
      `${testDescription}_1`,
      GlobalRole.USER
    );
    user2 = await createUserProfile(
      prismaTest,
      `${testDescription}_2`,
      GlobalRole.USER
    );
    token = generateJwtToken(user1.id, user1.globalRole);
    project = await createProject(prismaTest, testDescription, user1.id);
    await createProjectMember(
      prismaTest,
      project.id,
      user1.id,
      ProjectRole.ADMIN
    );

    await createProjectMember(
      prismaTest,
      project.id,
      user2.id,
      ProjectRole.VIEWER
    );
  });
  afterAll(async () => {
    await prismaTest.$disconnect();
  });

  it("should update the project member's role", async () => {
    const res = await request(app)
      .patch(`/api/projectMembers/${project.id}/members/${user2.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ projectRole: ProjectRole.USER });
    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      updatedProjectMember: {
        id: expect.any(Number),
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
        projectId: project.id,
        userId: user2.id,
        projectRole: ProjectRole.USER,
      },
      message: "Project member's role updated successfully",
    });
  });
});
