import { describe, expect, it, beforeAll, afterAll } from '@jest/globals';
import request from 'supertest';
import { redisClient, connectRedis } from '../../src/lib/connectRedis';

import { app } from '../../src/app';

// Positive Result:
// 1) Successful OTP Generation: Provide a proper email and get email, otp, messageId.
// Negative Result:
// 1) Unsuccessful OTP Generation: Get validation failure.

describe('Generate OTP', () => {
  const testDescription = 'generateOTP';
  beforeAll(async () => {
    await connectRedis();
  });
  afterAll(async () => {
    await redisClient.quit();
  });
  it('it should generate an otp with an associated email and message id', async () => {
    const res = await request(app)
      .get('/api/otpRoute')
      .send({ email: `${testDescription}@example.com` });
    expect(res.status).toBe(200);
    expect(res.body.message).toEqual('OTP generation successful');
    expect(res.body.data).toMatchObject({
      email: expect.any(String),
      otpValue: expect.any(String),
      messageId: expect.any(String),
    });
  });

  // Negative Result:
  // 1) Unsuccessful Login: Bad password
  it('should fail because of an invalid email', async () => {
    const res = await request(app)
      .get('/api/otpRoute')
      .send({ email: 'notAValidEmail' });
    expect(res.status).toBe(400);
  });
});
