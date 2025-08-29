import { describe, expect, afterAll, beforeAll, it } from '@jest/globals';
import request from 'supertest';

import {
  User,
  ProjectRole,
  Project,
  Organization,
  OrganizationRole,
} from '@prisma/client';
import { app } from '../../src/app';
import { prismaTest } from '../../src/lib/prismaTestClient';
import { createOrganization } from '../../src/utilities/testUtilities/createOrganization';
import { resetTestDatabase } from '../../src/utilities/testUtilities/resetTestDatabase';
import { createUserProfile } from '../../src/utilities/testUtilities/createUserProfile';
import { createProject } from '../../src/utilities/testUtilities/createProject';
import { createProjectMember } from '../../src/utilities/testUtilities/createProjectMember';
import { createOrgCountRecords } from '../../src/utilities/testUtilities/createOrgCountRecords';
import { deleteRedisKey } from '../../src/utilities/testUtilities/deleteRedisKey';
import { generateJwtToken } from '../../src/utilities/testUtilities/generateJwtToken';
import { ResourceType } from '../../src/types/ResourceAndColumnTypes';

describe('Create a board', () => {
  let token: string;
  let user: User;
  let project: Project;
  let organization: Organization;
  const testDescription = 'createABoard';
  const resourceType: ResourceType = 'Board';
  beforeAll(async () => {
    await prismaTest.$connect();
    await resetTestDatabase();
    organization = await createOrganization(prismaTest, testDescription);
    await createOrgCountRecords(prismaTest, organization.id);
    user = await createUserProfile(
      prismaTest,
      testDescription,
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
    await createProjectMember(
      prismaTest,
      project.id,
      user.id,
      ProjectRole.ADMIN,
      organization.id
    );
  });
  afterAll(async () => {
    await deleteRedisKey(organization.id, resourceType);
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
    expect(res.status).toBe(201);
    expect(res.body).toEqual(
      expect.objectContaining({
        data: {
          id: expect.any(Number),
          name: expect.any(String),
          projectId: expect.any(Number),
          description: expect.any(String),
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
          organizationId: expect.any(Number),
        },
        message: expect.any(String),
      })
    );
  });
});
