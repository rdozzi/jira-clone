import { describe, expect, afterAll, beforeAll, it } from '@jest/globals';
import { ResourceType } from '../../src/types/ResourceAndColumnTypes';
import { OrganizationRole, Organization, User } from '@prisma/client';

import { app } from '../../src/app';
import request from 'supertest';
import { prismaTest } from '../../src/lib/prismaTestClient';
import {
  redisClient,
  connectRedis,
} from '../../../server/src/lib/connectRedis';

import { createOrganization } from '../../src/utilities/testUtilities/createOrganization';
import { createOrgProjectCount } from '../../src/utilities/testUtilities/createOrgProjectCount';
import { createOrgActivityLogCount } from '../../src/utilities/testUtilities/createOrgActivityLogCount';
import { createUserProfile } from '../../src/utilities/testUtilities/createUserProfile';
import generateJwtToken from '../../src/utilities/testUtilities/generateJwtToken';
import { deleteRedisKey } from '../../src/utilities/testUtilities/deleteRedisKey';
import { resetTestDatabase } from '../../src/utilities/testUtilities/resetTestDatabase';

describe('Test project counters', () => {
  let token: string;
  let user: User;
  let organization: Organization;
  const resourceType: ResourceType = 'Project';
  const testDescription = 'TestProjectCounters';
  beforeAll(async () => {
    await prismaTest.$connect();
    await connectRedis();
    await resetTestDatabase();
    organization = await createOrganization(prismaTest, testDescription);
    await createOrgProjectCount(prismaTest, organization.id);
    await createOrgActivityLogCount(prismaTest, organization.id);
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

  it('daily and org-level project should be 1', async () => {
    await request(app)
      .post(`/api/projects`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: `Name_${testDescription}`,
        description: `Description_${testDescription}`,
      });
    const key = `org:${organization.id}:${resourceType}:daily`;
    const dailyCount = Number(await redisClient.get(key));
    expect(dailyCount).toEqual(1);

    const projectOrgTotal =
      await prismaTest.organizationProjectUsage.findUnique({
        where: { organizationId: organization.id },
        select: { totalProjects: true },
      });

    const totalCount = projectOrgTotal!.totalProjects;
    expect(totalCount).toEqual(1);
  });
  it('should reject creation call due to daily limit reached', async () => {
    const key = `org:${organization.id}:${resourceType}:daily`;
    await redisClient.set(key, 3);
    const res = await request(app)
      .post(`/api/projects`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: `Name_${testDescription}`,
        description: `Description_${testDescription}`,
      });
    expect(res.status).toBe(429);
    expect(res.body.message).toContain(
      'Requests exceeds daily limit for this resource'
    );
  });
  it('should reject creation call due to total limit reached', async () => {
    const key = `org:${organization.id}:${resourceType}:daily`;
    await redisClient.set(key, 0);
    await prismaTest.organizationProjectUsage.update({
      where: { organizationId: organization.id },
      data: { totalProjects: 20 },
    });
    const res = await request(app)
      .post(`/api/projects`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: `Name_${testDescription}`,
        description: `Description_${testDescription}`,
      });
    expect(res.status).toBe(403);
    expect(res.body.message).toContain(
      'The organization has reached the maximum limit of this resource'
    );
  });
});
