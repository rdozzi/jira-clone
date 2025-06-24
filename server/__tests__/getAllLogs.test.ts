import { describe, expect, afterAll, beforeAll, it } from '@jest/globals';
import request from 'supertest';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

import { User } from '@prisma/client';
import { app } from '../src/app';
import { prismaTest } from '../src/lib/prismaTestClient';
import { createGlobalAdmin } from '../src/utilities/testUtilities/createUserProfile';
import { resetTestDatabase } from '../src/utilities/testUtilities/resetTestDatabase';

dotenv.config();

describe('getAllLogs', () => {
  let user: User;
  let token: string;

  beforeAll(async () => {
    await prismaTest.$connect();
    await resetTestDatabase();
    user = await createGlobalAdmin(prismaTest);
    token = jwt.sign(
      { id: user.id, globalRole: user.globalRole },
      process.env.JWT_SECRET!,
      { expiresIn: '1hr' }
    );

    console.log(token);
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
