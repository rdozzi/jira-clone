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

describe('View all users from a project', () => {
  let token: string;
  let tokenSuper: string;
  let user1: User;
  let user2: User;
  let user3: User;
  let project: Project;
  const testDescription = 'View all users from a project';
  beforeAll(async () => {
    await prismaTest.$connect();
    await resetTestDatabase();
    user1 = await createUserProfile(
      prismaTest,
      `${testDescription}_1`,
      GlobalRole.ADMIN
    );
    user2 = await createUserProfile(
      prismaTest,
      `${testDescription}_2`,
      GlobalRole.USER
    );
    user3 = await createUserProfile(
      prismaTest,
      `${testDescription}_3`,
      GlobalRole.USER
    );
    const user4 = await createUserProfile(
      prismaTest,
      `${testDescription}_4`,
      GlobalRole.SUPERADMIN
    );
    token = generateJwtToken(user2.id, user2.globalRole);
    tokenSuper = generateJwtToken(user4.id, user4.globalRole);
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

    await createProjectMember(
      prismaTest,
      project.id,
      user3.id,
      ProjectRole.USER
    );
  });
  afterAll(async () => {
    await prismaTest.$disconnect();
  });

  it('should get all members of the project as a project viewer', async () => {
    const res = await request(app)
      .get(`/api/projectMembers/${project.id}/members`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(3);
  });
  it('should get all members of the project as a global superuser', async () => {
    const res = await request(app)
      .get(`/api/projectMembers/${project.id}/members`)
      .set('Authorization', `Bearer ${tokenSuper}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(3);
  });
});
