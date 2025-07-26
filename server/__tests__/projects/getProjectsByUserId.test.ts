import { describe, expect, afterAll, beforeAll, it } from '@jest/globals';
import request from 'supertest';

import {
  User,
  OrganizationRole,
  Organization,
  Project,
  ProjectRole,
} from '@prisma/client';
import { app } from '../../src/app';
import { prismaTest } from '../../src/lib/prismaTestClient';
import { createOrganization } from '../../src/utilities/testUtilities/createOrganization';
import { createUserProfile } from '../../src/utilities/testUtilities/createUserProfile';
import { createProject } from '../../src/utilities/testUtilities/createProject';
import { resetTestDatabase } from '../../src/utilities/testUtilities/resetTestDatabase';
import { generateJwtToken } from '../../src/utilities/testUtilities/generateJwtToken';
import { createProjectMember } from '../../src/utilities/testUtilities/createProjectMember';

describe('Get project by user id', () => {
  let token: string;
  let user: User;
  let project1: Project;
  let project2: Project;
  let organization: Organization;
  const testDescription = 'getProjectByUserId';

  beforeAll(async () => {
    await prismaTest.$connect();
    await resetTestDatabase();
    organization = await createOrganization(prismaTest, testDescription);
    user = await createUserProfile(
      prismaTest,
      testDescription,
      OrganizationRole.GUEST,
      organization.id
    );
    project1 = await createProject(
      prismaTest,
      `${testDescription}_1`,
      user.id,
      organization.id
    );
    project2 = await createProject(
      prismaTest,
      `${testDescription}_2`,
      user.id,
      organization.id
    );
    token = generateJwtToken(
      user.id,
      user.globalRole,
      user.organizationId,
      user.organizationRole
    );
    await createProjectMember(
      prismaTest,
      project1.id,
      user.id,
      ProjectRole.VIEWER,
      organization.id
    );
    await createProjectMember(
      prismaTest,
      project2.id,
      user.id,
      ProjectRole.VIEWER,
      organization.id
    );
  });
  afterAll(async () => {
    await prismaTest.$disconnect();
  });
  it('should get all projects', async () => {
    const res = await request(app)
      .get(`/api/projects/my-projects`)
      .set('Authorization', `Bearer ${token}`);
    console.log(res.body);
    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Projects fetched successfully');
    expect(res.body.data).toHaveLength(2);
  });
});
