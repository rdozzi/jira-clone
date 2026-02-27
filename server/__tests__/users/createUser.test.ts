import { describe, expect, afterAll, beforeAll, it } from '@jest/globals';
import request from 'supertest';

import { OrganizationRole, Organization, User } from '@prisma/client';
import { app } from '../../src/app';
import { prismaTest } from '../../src/lib/prismaTestClient';
import { createOrganization } from '../../src/utilities/testUtilities/createOrganization';
import { createUserProfile } from '../../src/utilities/testUtilities/createUserProfile';
import { resetTestDatabase } from '../../src/utilities/testUtilities/resetTestDatabase';
import { generateJwtToken } from '../../src/utilities/testUtilities/generateJwtToken';
import { createOrgCountRecords } from '../../src/utilities/testUtilities/createOrgCountRecords';
import { redisClient } from '../../src/lib/connectRedis';

describe('Create a user', () => {
  let token: string;
  let user: User;
  let organization: Organization;

  const testDescription = 'createAUser';
  beforeAll(async () => {
    await prismaTest.$connect();
    await resetTestDatabase();
    organization = await createOrganization(prismaTest, testDescription);
    await createOrgCountRecords(prismaTest, organization.id);
    user = await createUserProfile(
      prismaTest,
      testDescription,
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
    await redisClient.quit();
    await prismaTest.$disconnect();
  });

  it('should create a user', async () => {
    const res = await request(app)
      .post('/api/users')
      .set('Authorization', `Bearer ${token}`)
      .send({
        email: 'createAUser@example.com',
        firstName: 'Leonard',
        lastName: 'Nimoy',
        organizationRole: OrganizationRole.USER,
      });

    expect(res.status).toBe(201);
    expect(res.body.data).toEqual({
      id: expect.any(Number),
      firstName: 'Leonard',
      lastName: 'Nimoy',
      email: 'createAUser@example.com',
      passwordHash: expect.any(String),
      globalRole: 'USER',
      avatarSource: 'NA',
      isBanned: false,
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
      deletedAt: null,
      isDeleted: false,
      organizationId: expect.any(Number),
      organizationRole: expect.any(String),
      mustChangePassword: expect.any(Boolean),
    });
    expect(res.body.message).toEqual('User created successfully');
  });
});
