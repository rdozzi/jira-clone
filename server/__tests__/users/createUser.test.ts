import { describe, expect, afterAll, beforeAll, it } from '@jest/globals';
import request from 'supertest';

import { GlobalRole, User } from '@prisma/client';
import { app } from '../../src/app';
import { prismaTest } from '../../src/lib/prismaTestClient';
import { createUserProfile } from '../../src/utilities/testUtilities/createUserProfile';
import { resetTestDatabase } from '../../src/utilities/testUtilities/resetTestDatabase';
import { generateJwtToken } from '../../src/utilities/testUtilities/generateJwtToken';

describe('Create a user', () => {
  let token: string;
  let user: User;

  const testDescription = 'createAUser';
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

  it('should create a user', async () => {
    const res = await request(app)
      .post('/api/users')
      .set('Authorization', `Bearer ${token}`)
      .send({
        email: 'createAUser@example.com',
        firstName: 'Leonard',
        lastName: 'Nimoy',
        password: 'Test1234!',
        globalRole: GlobalRole.USER,
      });
    expect(res.status).toBe(201);
    expect(res.body).toEqual(
      expect.objectContaining({
        data: {
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
        },
        message: 'User successfully created.',
      })
    );
  });
});
