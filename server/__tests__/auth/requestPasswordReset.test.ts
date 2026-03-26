jest.mock('../../src/services/tokenServices/sendTokenEmail', () => ({
  sendTokenEmail: jest
    .fn<() => Promise<{ messageId: string; messageUrl: string }>>()
    .mockResolvedValue({
      messageId: 'test-id',
      messageUrl: 'test-url',
    } as { messageId: string; messageUrl: string }),
}));

jest.mock('../../src/lib/logBus', () => ({
  logBus: {
    emit: jest.fn(),
    on: jest.fn(),
  },
}));

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

import { User, OrganizationRole, Organization } from '@prisma/client';
import { app } from '../../src/app';
import { prismaTest } from '../../src/lib/prismaTestClient';
import { createOrganization } from '../../src/utilities/testUtilities/createOrganization';
import { createUserProfile } from '../../src/utilities/testUtilities/createUserProfile';
import { resetTestDatabase } from '../../src/utilities/testUtilities/resetTestDatabase';
import { sendTokenEmail } from '../../src/services/tokenServices/sendTokenEmail';
import { createOrgCountRecords } from '../../src/utilities/testUtilities/createOrgCountRecords';

import waitForExpect from 'wait-for-expect';

const mockedSendTokenEmail = sendTokenEmail as jest.MockedFunction<
  typeof sendTokenEmail
>;

describe('Request Password Reset', () => {
  const testDescription = 'Request_Password_Reset';
  let user: User;
  let organization: Organization;
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
  });
  beforeEach(async () => {
    jest.clearAllMocks();
  });
  afterAll(async () => {
    await prismaTest.$disconnect();
  });

  // Positive Result (New user):
  // 1) Successful Request
  it('should send the email successfully', async () => {
    const res = await request(app)
      .post('/api/auth/request-password-reset')
      .send({ email: user.email });
    expect(res.status).toBe(200);
    expect(res.body.message).toBe(
      'A reset email has been sent to this account.',
    );
    expect(sendTokenEmail).toHaveBeenCalled();
    await waitForExpect(async () => {
      const tokenRecord = await prismaTest.passwordToken.findFirst({
        where: { organizationId: organization.id },
      });
      expect(tokenRecord).toEqual({
        id: expect.any(Number),
        userId: expect.any(Number),
        tokenHash: expect.any(String),
        purpose: expect.any(String),
        expiresAt: expect.any(Date),
        hasBeenUsed: false,
        createdAt: expect.any(Date),
        organizationId: expect.any(Number),
      });
    });
  });
  it('should return 200 even if user does not exist', async () => {
    const res = await request(app)
      .post('/api/auth/request-password-reset')
      .send({ email: 'doesnotexist@example.com' });
    expect(res.status).toBe(200);
    expect(res.body.message).toBe(
      'A reset email has been sent to this account.',
    );
    expect(mockedSendTokenEmail).not.toHaveBeenCalled();
  });
  it('should still return 200 if token generation fails', async () => {
    mockedSendTokenEmail.mockRejectedValueOnce(new Error('Failure'));

    const res = await request(app)
      .post('/api/auth/request-password-reset')
      .send({ email: user.email });

    expect(res.status).toBe(200);
    expect(res.body.message).toBe(
      'A reset email has been sent to this account.',
    );
  });
  it('should reject if honeypot fields are filled', async () => {
    const res = await request(app)
      .post('/api/auth/request-password-reset')
      .send({
        email: user.email,
        contactFax: 'bot',
      });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe('Honeypot fields are defined. Bot detected.');
  });
  it('should return 400 for invalid email format', async () => {
    const res = await request(app)
      .post('/api/auth/request-password-reset')
      .send({ email: 'invalid-email' });

    expect(res.status).toBe(400);
  });
  it('should allow multiple reset requests safely', async () => {
    await request(app)
      .post('/api/auth/request-password-reset')
      .send({ email: user.email });

    const res = await request(app)
      .post('/api/auth/request-password-reset')
      .send({ email: user.email });

    expect(res.status).toBe(200);
  });
});
