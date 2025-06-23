import { describe, expect, afterAll, beforeAll, it } from '@jest/globals';
import { User } from '@prisma/client';
import request from 'supertest';
import { app } from '../src/app';
import { prismaTest } from '../src/lib/prismaTestClient';
import { createGlobalGuest } from '../src/utilities/testUtilities/createUserProfile';
import { resetTestDatabase } from '../src/utilities/testUtilities/resetTestDatabase';

// Positive Result:
// 1) Successful Login: Create credential, use credential to log in.
// Negative Result:
// 1) Failed Login: Enter wrong password for test user
// 2) Failed Login: Enter wrong information for non-exisent user

describe('Login Auth Route', () => {
  let globalGuest: User;
  beforeAll(async () => {
    await prismaTest.$connect();
    await resetTestDatabase();
    globalGuest = await createGlobalGuest(prismaTest);
  });
  afterAll(async () => {
    await resetTestDatabase();
    await prismaTest.$disconnect();
  });

  // Positive Result:
  // 1) Successful Login: Create credential, use credential to log in.
  it('should log in successfully with valid credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: globalGuest.email, password: globalGuest.passwordHash });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('token');
    expect(typeof res.body.token).toBe('string');
  });
});
