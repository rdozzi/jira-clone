import { describe, expect, afterAll, beforeAll, it } from '@jest/globals';
import request from 'supertest';

import { GlobalRole, User, BannedEmail } from '@prisma/client';
import { app } from '../../src/app';
import { prismaTest } from '../../src/lib/prismaTestClient';
import { createUserProfile } from '../../src/utilities/testUtilities/createUserProfile';
import { createBannedEmail } from '../../src/utilities/testUtilities/createBannedEmail';
import { resetTestDatabase } from '../../src/utilities/testUtilities/resetTestDatabase';
import { generateJwtToken } from '../../src/utilities/testUtilities/generateJwtToken';

describe('createBannedEmail', () => {
  let token: string;
  let user: User;
  let bannedEmail: BannedEmail;
  const testDescription = 'createBannedEmail';
  beforeAll(async () => {
    await prismaTest.$connect();
    await resetTestDatabase();
    user = await createUserProfile(
      prismaTest,
      testDescription,
      GlobalRole.ADMIN
    );
    token = generateJwtToken(user.id, user.globalRole);
    bannedEmail = await createBannedEmail(
      prismaTest,
      testDescription,
      1,
      'Banned Email 1'
    );
  });
  afterAll(async () => {
    await prismaTest.$disconnect();
  });

  it('should create a banned email record', async () => {
    const res = await request(app)
      .post('/api/bannedEmails')
      .set('Authorization', `Bearer ${token}`)
      .send({ email: 'banned_email@example.com', reason: 'Testing' });
    expect(res.status).toBe(201);
    expect(res.body).toEqual(
      expect.objectContaining({
        bannedEmail: 'banned_email@example.com',
        reason: 'Testing',
        message: 'Banned email created successfully',
      })
    );
  });
  it('should give an email already exists error message', async () => {
    const res = await request(app)
      .post('/api/bannedEmails')
      .set('Authorization', `Bearer ${token}`)
      .send({ email: bannedEmail.email, reason: 'Testing failure mode' });
    expect(res.status).toBe(409);
    expect(res.body.error).toEqual('Email already banned');
  });
});
