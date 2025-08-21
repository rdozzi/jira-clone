import { describe, expect, afterAll, beforeAll, it } from '@jest/globals';
import request from 'supertest';

import {
  OrganizationRole,
  Organization,
  User,
  Project,
  ProjectRole,
} from '@prisma/client';
import { app } from '../../src/app';
import { prismaTest } from '../../src/lib/prismaTestClient';
import { createOrganization } from '../../src/utilities/testUtilities/createOrganization';
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
  let organization: Organization;

  const testDescription = 'View all users from a project';
  beforeAll(async () => {
    await prismaTest.$connect();
    await resetTestDatabase();
    organization = await createOrganization(prismaTest, testDescription);
    user1 = await createUserProfile(
      prismaTest,
      `${testDescription}_1`,
      OrganizationRole.ADMIN,
      organization.id
    );
    user2 = await createUserProfile(
      prismaTest,
      `${testDescription}_2`,
      OrganizationRole.USER,
      organization.id
    );
    user3 = await createUserProfile(
      prismaTest,
      `${testDescription}_3`,
      OrganizationRole.USER,
      organization.id
    );
    const user4 = await createUserProfile(
      prismaTest,
      `${testDescription}_4`,
      OrganizationRole.SUPERADMIN,
      organization.id
    );
    token = generateJwtToken(
      user2.id,
      user2.globalRole,
      user2.organizationId,
      user2.organizationRole
    );
    tokenSuper = generateJwtToken(
      user4.id,
      user4.globalRole,
      user4.organizationId,
      user4.organizationRole
    );
    project = await createProject(
      prismaTest,
      testDescription,
      user1.id,
      organization.id
    );
    await createProjectMember(
      prismaTest,
      project.id,
      user1.id,
      ProjectRole.ADMIN,
      organization.id
    );

    await createProjectMember(
      prismaTest,
      project.id,
      user2.id,
      ProjectRole.VIEWER,
      organization.id
    );

    await createProjectMember(
      prismaTest,
      project.id,
      user3.id,
      ProjectRole.USER,
      organization.id
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
    expect(res.body.data).toHaveLength(3);
  });
  it('should get all members of the project as a organization SuperAdmin', async () => {
    const res = await request(app)
      .get(`/api/projectMembers/${project.id}/members`)
      .set('Authorization', `Bearer ${tokenSuper}`);
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(3);
  });
});
