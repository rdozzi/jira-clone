import { describe, expect, afterAll, beforeAll, it } from '@jest/globals';
import request from 'supertest';

import { GlobalRole, User } from '@prisma/client';
import { app } from '../../src/app';
import { prismaTest } from '../../src/lib/prismaTestClient';
import { createUserProfile } from '../../src/utilities/testUtilities/createUserProfile';
import { resetTestDatabase } from '../../src/utilities/testUtilities/resetTestDatabase';
import { generateJwtToken } from '../../src/utilities/testUtilities/generateJwtToken';

describe('Get User By Id or email', () => {
  let token: string;
  let user: User;

  const testDescription = 'getUserByIdOrEmail';
  beforeAll(async () => {
    await prismaTest.$connect();
    await resetTestDatabase();
    user = await createUserProfile(
      prismaTest,
      testDescription,
      GlobalRole.ADMIN
    );
    token = generateJwtToken(user.id, user.globalRole);
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
    expect(res.body).toEqual(
      expect.objectContaining({
        data: {
          id: expect.any(Number),
          firstName: expect.any(String),
          lastName: expect.any(String),
          email: expect.any(String),
          passwordHash: expect.any(String),
          globalRole: 'ADMIN',
          avatarSource: 'NA',
          isBanned: false,
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
          deletedAt: null,
          isDeleted: false,
        },
        message: expect.any(String),
      })
    );
  });
  it('Get user by email', async () => {
    const res = await request(app)
      .get(`/api/users`)
      .query({ userEmail: `${user.email}` })
      .set('Authorization', `Bearer ${token}`);
    console.log(res.body);
    expect(res.status).toBe(200);
    expect(res.body).toEqual(
      expect.objectContaining({
        data: {
          id: expect.any(Number),
          firstName: expect.any(String),
          lastName: expect.any(String),
          email: expect.any(String),
          passwordHash: expect.any(String),
          globalRole: 'ADMIN',
          avatarSource: 'NA',
          isBanned: false,
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
          deletedAt: null,
          isDeleted: false,
        },
        message: expect.any(String),
      })
    );
  });
});
