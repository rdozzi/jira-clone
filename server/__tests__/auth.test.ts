import { describe, expect, afterAll, beforeAll, it } from '@jest/globals';
import request from 'supertest';

import { GlobalRole, User } from '@prisma/client';
import { app } from '../src/app';
import { prismaTest } from '../src/lib/prismaTestClient';
import { createUserProfile } from '../src/utilities/testUtilities/createUserProfile';
import { resetTestDatabase } from '../src/utilities/testUtilities/resetTestDatabase';

// Positive Result:
// 1) Successful Login: Create credential, use credential to log in.
// Negative Result:
// 1) Failed Login: Enter wrong password for test user
// 2) Failed Login: Enter wrong information for non-exisent user

describe('Login Auth Route', () => {
  const testDescription = 'Login_Auth_Route';
  let user: User;
  beforeAll(async () => {
    await prismaTest.$connect();
    await resetTestDatabase();
    user = await createUserProfile(
      prismaTest,
      testDescription,
      GlobalRole.ADMIN
    );
  });
  afterAll(async () => {
    await prismaTest.$disconnect();
  });

  // Positive Result:
  // 1) Successful Login: Create credential, use credential to log in.
  it('should log in successfully with valid credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: user.email, password: 'seedPassword123' });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('token');
    expect(typeof res.body.token).toBe('string');
  });

  // Negative Results:
  // 1) Unsuccessful Login: Bad password
  it('should fail because of a bad password', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: user.email, password: 'incorrectPassword' });
    expect(res.status).toBe(401);
  });

  // 2) Unsuccessful Login: Bad email/User doesn't exist.
  it('should fail because of a bad email', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'idontexist@example.com', password: 'seedPassword123' });
    expect(res.status).toBe(401);
  });
});
