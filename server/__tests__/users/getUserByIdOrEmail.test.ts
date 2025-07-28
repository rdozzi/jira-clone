import { describe, expect, afterAll, beforeAll, it } from '@jest/globals';
import request from 'supertest';

import { OrganizationRole, Organization, User } from '@prisma/client';
import { app } from '../../src/app';
import { prismaTest } from '../../src/lib/prismaTestClient';
import { createOrganization } from '../../src/utilities/testUtilities/createOrganization';
import { createUserProfile } from '../../src/utilities/testUtilities/createUserProfile';
import { resetTestDatabase } from '../../src/utilities/testUtilities/resetTestDatabase';
import { generateJwtToken } from '../../src/utilities/testUtilities/generateJwtToken';

describe('Get User By Id or email', () => {
  let token: string;
  let user: User;
  let organization: Organization;

  const testDescription = 'getUserByIdOrEmail';
  beforeAll(async () => {
    await prismaTest.$connect();
    await resetTestDatabase();
    organization = await createOrganization(prismaTest, testDescription);
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
    await prismaTest.$disconnect();
  });

  it('Get user by id', async () => {
    const res = await request(app)
      .get(`/api/users`)
      .query({ userId: `${user.id}` })
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.data).toEqual({
      id: expect.any(Number),
      firstName: expect.any(String),
      lastName: expect.any(String),
      email: expect.any(String),
      passwordHash: expect.any(String),
      globalRole: expect.any(String),
      avatarSource: 'NA',
      isBanned: false,
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
      deletedAt: null,
      isDeleted: false,
      organizationId: expect.any(Number),
      organizationRole: expect.any(String),
    });
    expect(res.body.message).toBe('Users retrieved successfully');
  });
  it('Get user by email', async () => {
    const res = await request(app)
      .get(`/api/users`)
      .query({ userEmail: `${user.email}` })
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.data).toEqual({
      id: expect.any(Number),
      firstName: expect.any(String),
      lastName: expect.any(String),
      email: expect.any(String),
      passwordHash: expect.any(String),
      globalRole: expect.any(String),
      avatarSource: 'NA',
      isBanned: false,
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
      deletedAt: null,
      isDeleted: false,
      organizationId: expect.any(Number),
      organizationRole: expect.any(String),
    });
    expect(res.body.message).toBe('Users retrieved successfully');
  });
});
