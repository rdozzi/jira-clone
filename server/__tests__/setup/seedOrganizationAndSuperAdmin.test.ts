import { describe, expect, it, beforeAll, afterAll } from '@jest/globals';
import request from 'supertest';
import { redisClient, connectRedis } from '../../src/lib/connectRedis';
import { prismaTest } from '../../src/lib/prismaTestClient';
import { resetTestDatabase } from '../../src/utilities/testUtilities/resetTestDatabase';

import { app } from '../../src/app';
import { createOTP } from '../../src/utilities/testUtilities/createOTP';

// Positive Result:
// 1) Successful OTP Generation: Provide a proper email and get email, otp, messageId.
// Negative Result:
// 1) Third-party fail: Send email that looks like fraud.
// 2) Frequency exceeded fail: Send email that will fail 5+ times.

interface OTPPayload {
  email: string;
  otpValue: { [KeyObject: string]: string };
}

describe.skip('Test seed organization and SuperAdmin route', () => {
  const testDescription = 'seedOrganizationAndSuperAdminRoute';
  const goodEmail = 'rdozzi84@gmail.com';
  const thirdPartyFailEmail = 'test@guerrillamail.com';
  // const frequencyFailEmail = 'test@example.com';
  let otpPayload1: OTPPayload;
  let otpPayload2: OTPPayload;
  beforeAll(async () => {
    await prismaTest.$connect();
    await resetTestDatabase();
    await connectRedis();
    otpPayload1 = (await createOTP(goodEmail)) as unknown as OTPPayload;
    otpPayload2 = (await createOTP(
      thirdPartyFailEmail
    )) as unknown as OTPPayload;
  });
  afterAll(async () => {
    await redisClient.quit();
    await prismaTest.$disconnect();
  });
  it('it should generate an otp with an associated email and message id', async () => {
    const res = await request(app)
      .post('/api/setup/seedOrganizationAndSuperAdmin')
      .send({
        email: goodEmail,
        firstName: 'FirstName',
        lastName: 'LastName',
        password: 'TestPassword123!',
        organizationName: `${testDescription}`,
        otp: otpPayload1.otpValue,
      });
    expect(res.status).toBe(201);
    expect(res.body.message).toEqual(
      `Organization and user created successfully`
    );
    expect(res.body.data.organization).toMatchObject({
      id: expect.any(Number),
      name: expect.any(String),
      createAt: expect.any(String),
      updatedAt: expect.any(String),
      deletedAt: null,
      isDeleted: expect.any(Boolean),
    });
    expect(res.body.data.user).toMatchObject({
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
      organizationId: expect.any(Number),
      organizationRole: expect.any(String),
    });
  });
  it('it should fail due to a suspicious looking email', async () => {
    const res = await request(app)
      .post('/api/setup/seedOrganizationAndSuperAdmin')
      .send({
        email: thirdPartyFailEmail,
        firstName: 'FirstName',
        lastName: 'LastName',
        password: 'TestPassword123!',
        organizationName: `${testDescription}`,
        otp: otpPayload2.otpValue,
      });

    expect(res.status).toBe(403);
    expect(res.body.message).toBe(
      'Request denied. Disposable email addresses are not allowed.'
    );
  });
  // it('it should fail due to too many attempts', async () => {
  //   for (let i = 0; i < 5; i++) {
  //     request(app)
  //       .post('/api/setup/seedOrganizationAndSuperAdmin')
  //       .send({
  //         email: frequencyFailEmail,
  //         firstName: 'FirstName',
  //         lastName: 'LastName',
  //         password: 'TestPassword123!',
  //         organizationName: `${testDescription}`,
  //         otp: otpPayload.otpValue,
  //       });
  //   }
  //   const res = await request(app)
  //     .post('/api/setup/seedOrganizationAndSuperAdmin')
  //     .send({
  //       email: frequencyFailEmail,
  //       firstName: 'FirstName',
  //       lastName: 'LastName',
  //       password: 'TestPassword123!',
  //       organizationName: `${testDescription}`,
  //       otp: otpPayload.otpValue,
  //     });

  //   expect(res.status).toBe(429);
  //   expect(res.body.message).toBe(
  //     'Too many attempts with this email address. Try again in 24 hours'
  //   );
  // });
});
