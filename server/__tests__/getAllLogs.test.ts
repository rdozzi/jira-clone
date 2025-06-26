import { describe, expect, afterAll, beforeAll, it } from '@jest/globals';
import request from 'supertest';
import dotenv from 'dotenv';

import { GlobalRole, User } from '@prisma/client';
import { app } from '../src/app';
import { prismaTest } from '../src/lib/prismaTestClient';
import { createUserProfile } from '../src/utilities/testUtilities/createUserProfile';
import { resetTestDatabase } from '../src/utilities/testUtilities/resetTestDatabase';
import { generateJwtToken } from '../src/utilities/testUtilities/generateJwtToken';

dotenv.config();

describe('getAllLogs', () => {
  const testDescription = 'getAllLogs';
  let user: User;
  let token: string;

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

  it('should return all activity logs for an ADMIN user', async () => {
    const res = await request(app)
      .get('/api/activity-logs/all')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
  });
});
