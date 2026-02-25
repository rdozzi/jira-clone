import { describe, expect, afterAll, beforeAll, it } from '@jest/globals';
import request from 'supertest';

import { OrganizationRole, Organization, User } from '@prisma/client';
import { app } from '../../src/app';
import { prismaTest } from '../../src/lib/prismaTestClient';
import { createOrganization } from '../../src/utilities/testUtilities/createOrganization';
import { createUserProfile } from '../../src/utilities/testUtilities/createUserProfile';
import { resetTestDatabase } from '../../src/utilities/testUtilities/resetTestDatabase';
import { generateJwtToken } from '../../src/utilities/testUtilities/generateJwtToken';

describe('Get user by organization id', () => {
  let token1: string;
  let user1: User;
  let organization: Organization;

  const testDescription = 'GetUserByOrganizationId';
  beforeAll(async () => {
    await prismaTest.$connect();
    await resetTestDatabase();
    organization = await createOrganization(prismaTest, testDescription);
    user1 = await createUserProfile(
      prismaTest,
      testDescription,
      OrganizationRole.USER,
      organization.id,
    );
    await createUserProfile(
      prismaTest,
      testDescription,
      OrganizationRole.ADMIN,
      organization.id,
    );
    token1 = generateJwtToken(
      user1.id,
      user1.globalRole,
      user1.organizationId,
      user1.organizationRole,
    );
  });
  afterAll(async () => {
    await prismaTest.$disconnect();
  });

  it('Should return an array of two objects', async () => {
    const res = await request(app)
      .get(`/api/users/organization`)
      .set('Authorization', `Bearer ${token1}`);
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(2);
    expect(res.body.data).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: expect.any(Number),
          firstName: expect.any(String),
          lastName: expect.any(String),
          email: expect.any(String),
          organizationRole: expect.any(String),
          createdAt: expect.any(String),
        }),
      ]),
    );
  });
});
