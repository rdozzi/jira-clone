import { describe, expect, afterAll, beforeAll, it } from '@jest/globals';
import request from 'supertest';

import { User } from '@prisma/client';
import { app } from '../../src/app';
import { prismaTest } from '../../src/lib/prismaTestClient';
import { createSuperUser } from '../../src/utilities/testUtilities/createSuperUser';
import { resetTestDatabase } from '../../src/utilities/testUtilities/resetTestDatabase';
import { generateJwtToken } from '../../src/utilities/testUtilities/generateJwtToken';

describe('Get SuperUsers', () => {
  let token: string;
  let superUser1: User;
  let superUser2: User;
  const testDescription = 'getSuperUsers';

  beforeAll(async () => {
    await prismaTest.$connect();
    await resetTestDatabase();
    superUser1 = await createSuperUser(prismaTest, `${testDescription}_1`);
    superUser2 = await createSuperUser(prismaTest, `${testDescription}_2`);
    token = generateJwtToken(superUser1.id, superUser1.globalRole, null, null);
  });
  afterAll(async () => {
    await prismaTest.$disconnect();
  });

  it('should get all users', async () => {
    const res = await request(app)
      .get(`/api/superuser/profiles`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Users fetched successfully');
    expect(res.body.data).toHaveLength(2);
  });

  it('should get a single user', async () => {
    const res = await request(app)
      .get(`/api/superuser/profiles`)
      .set('Authorization', `Bearer ${token}`)
      .query({ userId: `${superUser2.id}` });
    expect(res.status).toBe(200);
    expect(res.body.message).toBe('User fetched successfully');
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
      organizationId: null,
      organizationRole: null,
    });
  });
});
