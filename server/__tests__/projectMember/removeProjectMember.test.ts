import { describe, expect, afterAll, beforeAll, it } from '@jest/globals';
import request from 'supertest';
import waitForExpect from 'wait-for-expect';

import { GlobalRole, User, Project, ProjectRole } from '@prisma/client';
import { app } from '../../src/app';
import { prismaTest } from '../../src/lib/prismaTestClient';
import { createUserProfile } from '../../src/utilities/testUtilities/createUserProfile';
import { createProject } from '../../src/utilities/testUtilities/createProject';
import { createProjectMember } from '../../src/utilities/testUtilities/createProjectMember';
import { resetTestDatabase } from '../../src/utilities/testUtilities/resetTestDatabase';
import { generateJwtToken } from '../../src/utilities/testUtilities/generateJwtToken';

describe('Remove project member', () => {
  let token: string;
  let user1: User;
  let user2: User;
  let project: Project;
  const testDescription = 'Remove project member';
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
    project = await createProject(prismaTest, testDescription);
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

  it('should remove a member from the project', async () => {
    const res = await request(app)
      .delete(`/api/projectMembers/${project.id}/members/${user2.id}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      removedUserData: {
        id: expect.any(Number),
        firstName: expect.any(String),
        lastName: expect.any(String),
        email: expect.any(String),
      },
      message: 'Project member removed successfully',
    });
    await waitForExpect(async () => {
      const projectMember = await prismaTest.projectMember.findUnique({
        where: {
          userId_projectId: { userId: user2.id, projectId: project.id },
        },
      });

      expect(projectMember).toBeNull();
    });
  });
});
