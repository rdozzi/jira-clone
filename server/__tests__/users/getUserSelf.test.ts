import { describe, expect, afterAll, beforeAll, it } from '@jest/globals';
import request from 'supertest';

import { User, Organization, OrganizationRole } from '@prisma/client';
import { app } from '../../src/app';
import { prismaTest } from '../../src/lib/prismaTestClient';
import { createOrganization } from '../../src/utilities/testUtilities/createOrganization';
import { createUserProfile } from '../../src/utilities/testUtilities/createUserProfile';
import { resetTestDatabase } from '../../src/utilities/testUtilities/resetTestDatabase';
import { generateJwtToken } from '../../src/utilities/testUtilities/generateJwtToken';

describe('Get user self', () => {
  let token: string;
  let user1: User;
  const testDescription = 'GetUserSelf';
  let organization: Organization;

  beforeAll(async () => {
    await prismaTest.$connect();
    await resetTestDatabase();
    organization = await createOrganization(prismaTest, testDescription);
    user1 = await createUserProfile(
      prismaTest,
      `${testDescription}_1`,
      OrganizationRole.ADMIN,
      organization.id,
    );
    token = generateJwtToken(
      user1.id,
      user1.globalRole,
      user1.organizationId,
      user1.organizationRole,
    );
  });
  afterAll(async () => {
    await prismaTest.$disconnect();
  });

  it("should get the user's self profile", async () => {
    const res = await request(app)
      .get(`/api/users/self`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.message).toBe('User retrieved successfully');
    expect(res.body.data).toEqual(
      expect.objectContaining({
        id: expect.any(Number),
        firstName: expect.any(String),
        lastName: expect.any(String),
        email: expect.any(String),
        organizationId: expect.any(Number),
        organizationRole: expect.any(String),
        createdAt: expect.any(String),
      }),
    );
  });
});
