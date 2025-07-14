import { describe, expect, afterAll, beforeAll, it } from '@jest/globals';
import request from 'supertest';

import { User, GlobalRole } from '@prisma/client';
import { app } from '../../src/app';
import { prismaTest } from '../../src/lib/prismaTestClient';
import { createUserProfile } from '../../src/utilities/testUtilities/createUserProfile';
import { resetTestDatabase } from '../../src/utilities/testUtilities/resetTestDatabase';
import { generateJwtToken } from '../../src/utilities/testUtilities/generateJwtToken';

describe('Get all users', () => {
  let token: string;
  let user1: User;
  const testDescription = 'getAllUsers';
  beforeAll(async () => {
    await prismaTest.$connect();
    await resetTestDatabase();
    user1 = await createUserProfile(
      prismaTest,
      `${testDescription}_1`,
      GlobalRole.ADMIN
    );
    //user 2
    await createUserProfile(
      prismaTest,
      `${testDescription}_2`,
      GlobalRole.USER
    );
    //user 3
    await createUserProfile(
      prismaTest,
      `${testDescription}_3`,
      GlobalRole.GUEST
    );
    //user 4
    await createUserProfile(
      prismaTest,
      `${testDescription}_4`,
      GlobalRole.GUEST
    );

    token = generateJwtToken(user1.id, user1.globalRole);
  });
  afterAll(async () => {
    await prismaTest.$disconnect();
  });

  it('should get all users', async () => {
    const res = await request(app)
      .patch(`/api/users/all`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Users fetched successfully');
    expect(res.body.users).toHaveLength(4);
  });
});
