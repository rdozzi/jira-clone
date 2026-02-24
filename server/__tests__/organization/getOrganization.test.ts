import { describe, expect, afterAll, beforeAll, it } from '@jest/globals';
import request from 'supertest';

import { User, OrganizationRole, Organization } from '@prisma/client';
import { app } from '../../src/app';
import { prismaTest } from '../../src/lib/prismaTestClient';
import { createOrganization } from '../../src/utilities/testUtilities/createOrganization';
import { createUserProfile } from '../../src/utilities/testUtilities/createUserProfile';
import { resetTestDatabase } from '../../src/utilities/testUtilities/resetTestDatabase';
import { generateJwtToken } from '../../src/utilities/testUtilities/generateJwtToken';

describe('Get Organization By User', () => {
  let token: string;
  let user: User;
  let organization: Organization;

  const testDescription = 'getOrganization';
  beforeAll(async () => {
    await prismaTest.$connect();
    await resetTestDatabase();
    organization = await createOrganization(prismaTest, testDescription);
    console.log(organization);
    user = await createUserProfile(
      prismaTest,
      `${testDescription}_1`,
      OrganizationRole.ADMIN,
      organization.id,
    );
    token = generateJwtToken(
      user.id,
      user.globalRole,
      user.organizationId,
      user.organizationRole,
    );
  });
  afterAll(async () => {
    await prismaTest.$disconnect();
  });

  it('should get the organization by userId', async () => {
    const res = await request(app)
      .get(`/api/organization`)
      .set('Authorization', `Bearer ${token}`);
    console.log(res.body.data);
    // console.log(typeof res.body.data);
    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Organization fetched successfully');
    expect(res.body.data).toEqual(
      expect.objectContaining({
        id: expect.any(Number),
        name: expect.any(String),
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
        deletedAt: null,
        isDeleted: false,
      }),
    );
  });
});
