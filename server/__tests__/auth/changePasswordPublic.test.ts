import {
  describe,
  expect,
  afterAll,
  beforeAll,
  beforeEach,
  it,
  jest,
} from '@jest/globals';
import request from 'supertest';
import bcrypt from 'bcrypt';

import {
  User,
  OrganizationRole,
  Organization,
  PasswordToken,
  TokenPurpose,
} from '@prisma/client';
import { app } from '../../src/app';
import prisma from '../../src/lib/prisma';
import { prismaTest } from '../../src/lib/prismaTestClient';
import { createOrganization } from '../../src/utilities/testUtilities/createOrganization';
import { createUserProfile } from '../../src/utilities/testUtilities/createUserProfile';
import { resetTestDatabase } from '../../src/utilities/testUtilities/resetTestDatabase';
import { createOrgCountRecords } from '../../src/utilities/testUtilities/createOrgCountRecords';
import { createPasswordToken } from '../../src/utilities/testUtilities/createPasswordToken';
import { generateHashedToken } from '../../src/utilities/tokenUtilities/generateToken';

describe('Request Password Reset', () => {
  const RAW_TOKEN =
    'a3f9c1b7e4d8a2f6b0c9e1d3f7a5b8c2d4e6f0a1b3c5d7e9f2a4c6b8d0e1f3a5';
  const RAW_TOKEN_2 =
    '5e8b2c7a1f9d4e3c6a0b8d1f2c7e9a4b6d3f0c1a9e2b7d4c8f1a0e6b3c9d2f7c';
  const testDescription = 'Request_Password_Reset';
  let user: User;
  let user2: User; // Registered User changing forgot password
  let organization: Organization;
  let tokenRecord: PasswordToken;
  let tokenRecord2: PasswordToken;
  beforeAll(async () => {
    await prismaTest.$connect();
    await resetTestDatabase();
    organization = await createOrganization(prismaTest, testDescription);
    await createOrgCountRecords(prismaTest, organization.id);
    user = await createUserProfile(
      prismaTest,
      testDescription,
      OrganizationRole.USER,
      organization.id,
      { mustChangePassword: true, isEmailVerified: false },
    );
    user2 = await createUserProfile(
      prismaTest,
      `${testDescription}_2`,
      OrganizationRole.USER,
      organization.id,
      { mustChangePassword: false, isEmailVerified: true },
    );
    tokenRecord = await createPasswordToken(
      prismaTest,
      user.id,
      RAW_TOKEN,
      organization.id,
      TokenPurpose.ACCOUNT_ACTIVATION,
    );
    // Create a token for user2
    tokenRecord2 = await createPasswordToken(
      prismaTest,
      user2.id,
      RAW_TOKEN_2,
      organization.id,
      TokenPurpose.RESET_PASSWORD,
    );
  });
  beforeEach(async () => {
    await prismaTest.passwordToken.update({
      where: { tokenHash: generateHashedToken(RAW_TOKEN) },
      data: { hasBeenUsed: false, expiresAt: new Date(Date.now() + 15000) },
    });
  });
  afterAll(async () => {
    await prismaTest.$disconnect();
  });

  // Positive Result (New user):
  // 1) Successful Request: User password changed, password token hasBeenUsed set to true
  it('should send the email successfully', async () => {
    const res = await request(app)
      .post('/api/auth/change-password-public')
      .query({ rawToken: RAW_TOKEN })
      .send({ newPassword: 'newPassword!1', confirmPassword: 'newPassword!1' });
    const updatedUser = await prismaTest.user.findUnique({
      where: { id: user.id },
    });
    const updatedToken = await prismaTest.passwordToken.findUnique({
      where: { tokenHash: tokenRecord.tokenHash },
    });
    expect(
      await bcrypt.compare('newPassword!1', updatedUser!.passwordHash!),
    ).toBe(true);
    expect(
      await bcrypt.compare('seedPassword123', updatedUser!.passwordHash!),
    ).toBe(false);
    expect(updatedUser?.mustChangePassword).toBe(false);
    expect(updatedUser?.isEmailVerified).toBe(true);
    expect(updatedToken?.hasBeenUsed).toBe(true);
    expect(res.status).toBe(200);
    expect(res.body.message).toBe('User password updated successfully');
  });
  // 2) Invalid Token
  it('should return 400 for invalid token', async () => {
    const res = await request(app)
      .post('/api/auth/change-password-public')
      .query({ rawToken: 'invalidtoken' })
      .send({ newPassword: 'newPassword!1', confirmPassword: 'newPassword!1' });

    expect(res.status).toBe(400);
  });
  // 3) Reject already used token
  it('should reject already used token', async () => {
    await prismaTest.passwordToken.update({
      where: { id: tokenRecord.id },
      data: { hasBeenUsed: true },
    });

    const res = await request(app)
      .post('/api/auth/change-password-public')
      .query({ rawToken: RAW_TOKEN })
      .send({ newPassword: 'newPassword!1', confirmPassword: 'newPassword!1' });

    expect(res.status).toBe(400);
  });
  // 4) Reject expired token
  it('should reject expired token', async () => {
    await prismaTest.passwordToken.update({
      where: { id: tokenRecord.id },
      data: { expiresAt: new Date(Date.now() - 1000) },
    });

    const res = await request(app)
      .post('/api/auth/change-password-public')
      .query({ rawToken: RAW_TOKEN })
      .send({ newPassword: 'newPassword!1', confirmPassword: 'newPassword!1' });

    expect(res.status).toBe(400);
  });
  // 5) Reject mismatched passwords
  it('should reject mismatched passwords', async () => {
    const res = await request(app)
      .post('/api/auth/change-password-public')
      .query({ rawToken: RAW_TOKEN })
      .send({ newPassword: 'newPassword!1', confirmPassword: 'different!1' });

    expect(res.status).toBe(400);
  });
  // 6) Reject weak password
  it('should reject weak password', async () => {
    const res = await request(app)
      .post('/api/auth/change-password-public')
      .query({ rawToken: RAW_TOKEN })
      .send({ newPassword: '123', confirmPassword: '123' });

    expect(res.status).toBe(400);
  });
  // 7) Should reject missing token
  it('should reject missing token', async () => {
    const res = await request(app)
      .post('/api/auth/change-password-public')
      .send({ newPassword: 'newPassword!1', confirmPassword: 'newPassword!1' });

    expect(res.status).toBe(400);
  });
  // 8) Should reject missing password fields
  it('should reject missing password fields', async () => {
    const res = await request(app)
      .post('/api/auth/change-password-public')
      .query({ rawToken: RAW_TOKEN })
      .send({});

    expect(res.status).toBe(400);
  });
  // 9) Should not partially update records
  it('should not partially update on failure', async () => {
    const spy = jest
      .spyOn(prisma, '$transaction')
      .mockRejectedValueOnce(new Error('DB fail'));

    const res = await request(app)
      .post('/api/auth/change-password-public')
      .query({ rawToken: RAW_TOKEN_2 })
      .send({ newPassword: 'newPassword!1', confirmPassword: 'newPassword!1' });

    const unchangedUser = await prismaTest.user.findUnique({
      where: { id: user2.id },
    });

    const unchangedToken = await prismaTest.passwordToken.findUnique({
      where: { id: tokenRecord2.id },
    });

    expect(res.status).toBe(500);
    expect(
      await bcrypt.compare('seedPassword123', unchangedUser!.passwordHash!),
    ).toBe(true);
    expect(unchangedToken?.hasBeenUsed).toBe(false);

    spy.mockRestore();
  });
  // 10) Should reject tokenPurpose mismatch
  it('should reject token with incorrect purpose', async () => {
    await createPasswordToken(
      prismaTest,
      user.id,
      'differenttoken',
      organization.id,
      TokenPurpose.RESET_PASSWORD,
    );

    const res = await request(app)
      .post('/api/auth/change-password-public')
      .query({ rawToken: 'differenttoken' })
      .send({ newPassword: 'newPassword!1', confirmPassword: 'newPassword!1' });

    expect(res.status).toBe(400);
  });
  // 11) Reject token re-use attempt
  it('should not allow token reuse', async () => {
    await request(app)
      .post('/api/auth/change-password-public')
      .query({ rawToken: RAW_TOKEN })
      .send({ newPassword: 'newPassword!1', confirmPassword: 'newPassword!1' });

    const res = await request(app)
      .post('/api/auth/change-password-public')
      .query({ rawToken: RAW_TOKEN })
      .send({
        newPassword: 'anotherPassword!1',
        confirmPassword: 'anotherPassword!1',
      });

    expect(res.status).toBe(400);
  });
});
