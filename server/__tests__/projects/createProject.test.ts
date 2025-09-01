import { describe, expect, afterAll, beforeAll, it } from '@jest/globals';
import request from 'supertest';

import { OrganizationRole, Organization, User } from '@prisma/client';
import { app } from '../../src/app';
import { prismaTest } from '../../src/lib/prismaTestClient';
import { createOrganization } from '../../src/utilities/testUtilities/createOrganization';
import { resetTestDatabase } from '../../src/utilities/testUtilities/resetTestDatabase';
import { createUserProfile } from '../../src/utilities/testUtilities/createUserProfile';
import { generateJwtToken } from '../../src/utilities/testUtilities/generateJwtToken';
import { createOrgCountRecords } from '../../src/utilities/testUtilities/createOrgCountRecords';
import { deleteRedisKey } from '../../src/utilities/testUtilities/deleteRedisKey';
import { ResourceType } from '../../src/types/ResourceAndColumnTypes';

describe('Create a project', () => {
  let token: string;
  let user: User;
  let organization: Organization;
  const resourceType: ResourceType = 'Project';
  const testDescription = 'createAProject';
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
  });
  afterAll(async () => {
    await deleteRedisKey(organization.id, resourceType);
    await prismaTest.$disconnect();
  });

  it('should create a project', async () => {
    const res = await request(app)
      .post(`/api/projects`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: `Test1_Name_${testDescription}`,
        description: `Test1_Description_${testDescription}`,
      });
    expect(res.status).toBe(201);
    expect(res.body).toEqual(
      expect.objectContaining({
        data: {
          id: expect.any(Number),
          name: expect.any(String),
          ownerId: expect.any(Number),
          description: expect.any(String),
          status: expect.any(String),
          isPublic: expect.any(Boolean),
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
          organizationId: expect.any(Number),
        },
        message: expect.any(String),
      })
    );
  });
  it('should add that user to the project', async () => {
    const res = await request(app)
      .post(`/api/projects`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: `Test2_Name_${testDescription}`,
        description: `Test2_Description_${testDescription}`,
      });
    const projectMember = await prismaTest.projectMember.findUnique({
      where: {
        userId_projectId: {
          userId: user.id,
          projectId: res.body.data.id,
        },
      },
    });

    expect(projectMember).toBeDefined();
  });
});
