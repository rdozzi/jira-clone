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
import { createOrgCountRecords } from '../../src/utilities/testUtilities/createOrgCountRecords';

describe('Add project member', () => {
  let token: string;
  let user1: User;
  let user2: User;
  let project: Project;
  const testDescription = 'Add project member';
  let organization: Organization;

  beforeAll(async () => {
    await prismaTest.$connect();
    await resetTestDatabase();
    organization = await createOrganization(prismaTest, testDescription);
    await createOrgCountRecords(prismaTest, organization.id);
    user1 = await createUserProfile(
      prismaTest,
      `${testDescription}_1`,
      OrganizationRole.USER,
      organization.id
    );
    user2 = await createUserProfile(
      prismaTest,
      `${testDescription}_2`,
      OrganizationRole.USER,
      organization.id
    );
    token = generateJwtToken(
      user1.id,
      user1.globalRole,
      user1.organizationId,
      user1.organizationRole
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
  });
  afterAll(async () => {
    await prismaTest.$disconnect();
  });

  it('should add a member to the project', async () => {
    const res = await request(app)
      .post(`/api/projectMembers/${project.id}/members`)
      .set('Authorization', `Bearer ${token}`)
      .send({ userId: user2.id, projectRole: ProjectRole.VIEWER });
    expect(res.status).toBe(201);
    expect(res.body).toEqual({
      newProjectMember: {
        id: expect.any(Number),
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
        projectId: project.id,
        userId: user2.id,
        projectRole: ProjectRole.VIEWER,
        organizationId: expect.any(Number),
      },
      message: 'Project member added successfully',
    });
  });
});
