import { describe, expect, afterAll, beforeAll, it } from '@jest/globals';
import request from 'supertest';

import {
  User,
  BannedEmail,
  OrganizationRole,
  Organization,
} from '@prisma/client';
import { app } from '../../src/app';
import { prismaTest } from '../../src/lib/prismaTestClient';
import { createOrganization } from '../../src/utilities/testUtilities/createOrganization';
import { createUserProfile } from '../../src/utilities/testUtilities/createUserProfile';
import { createBannedEmail } from '../../src/utilities/testUtilities/createBannedEmail';
import { resetTestDatabase } from '../../src/utilities/testUtilities/resetTestDatabase';
import { generateJwtToken } from '../../src/utilities/testUtilities/generateJwtToken';
import { createOrgCountRecords } from '../../src/utilities/testUtilities/createOrgCountRecords';
import { redisClient } from '../../src/lib/connectRedis';

describe('createBannedEmail', () => {
  let token: string;
  let user: User;
  let bannedEmail: BannedEmail;
  let organization: Organization;
  const testDescription = 'createBannedEmail';
  beforeAll(async () => {
    await prismaTest.$connect();
    await resetTestDatabase();
    organization = await createOrganization(prismaTest, testDescription);
    await createOrgCountRecords(prismaTest, organization.id);
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
    bannedEmail = await createBannedEmail(
      prismaTest,
      testDescription,
      1,
      'Banned Email 1',
      organization.id
    );
  });
  afterAll(async () => {
    redisClient.quit();
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
      .send({ email: `${bannedEmail.email}`, reason: 'Testing failure mode' });
    expect(res.status).toBe(409);
    expect(res.body.error).toEqual('Email already banned');
  });
});
