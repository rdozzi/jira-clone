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
import { describe, expect, it, beforeAll, afterAll, jest } from '@jest/globals';
import request from 'supertest';
import { prismaTest } from '../../src/lib/prismaTestClient';
import { resetTestDatabase } from '../../src/utilities/testUtilities/resetTestDatabase';
import { sendTokenEmail } from '../../src/services/tokenServices/sendTokenEmail';
import { app } from '../../src/app';
import { Prisma } from '@prisma/client';
import prisma from '../../src/lib/prisma';

// Positive Result:
// 1) Create organization and superuser

describe('Test organization and superadmin route', () => {
  // const testDescription = 'CreateOrg&SuperAdmin';
  beforeAll(async () => {
    await prismaTest.$connect();
    await resetTestDatabase();
  });
  afterAll(async () => {
    await prismaTest.$disconnect();
  });

  const payload = {
    acceptTerms: true,
    contactFax: undefined,
    duration: 1151910,
    email: 'createauser@example.com',
    firstName: 'Leonard',
    lastName: 'Nimoy',
    organizationName: `Acme Co.`,
    secondaryEmail: undefined,
  };

  it('should create organization and superadmin', async () => {
    const res = await request(app)
      .post('/api/setup/create-organization-and-superadmin')
      .send(payload);
    expect(res.status).toBe(201);
    expect(res.body.message).toEqual(
      `Organization and user created successfully`,
    );
    expect(res.body.data.organization).toMatchObject({
      id: expect.any(Number),
      name: expect.any(String),
      slug: expect.any(String),
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
      deletedAt: null,
      isDeleted: expect.any(Boolean),
    });
    expect(res.body.data.user).toMatchObject({
      id: expect.any(Number),
      firstName: 'Leonard',
      lastName: 'Nimoy',
      email: 'createauser@example.com',
      passwordHash: null,
      globalRole: 'USER',
      avatarSource: 'NA',
      isBanned: false,
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
      deletedAt: null,
      isDeleted: false,
      organizationId: expect.any(Number),
      organizationRole: 'SUPERADMIN',
      mustChangePassword: expect.any(Boolean),
      isDemoUser: expect.any(Boolean),
      isEmailVerified: expect.any(Boolean),
    });
    expect(sendTokenEmail).toHaveBeenCalled();
  });
  // Allow duplicate organization names via slug iteration; users' email must be different
  it('should allow duplicate organization names via slug iteration', async () => {
    await request(app)
      .post('/api/setup/create-organization-and-superadmin')
      .send(payload);

    const res = await request(app)
      .post('/api/setup/create-organization-and-superadmin')
      .send({ ...payload, email: 'createauser2@example.com' });

    expect(res.status).toBe(201);
    const orgs = await prismaTest.organization.findMany();
    expect(orgs.length).toBe(2);
    expect(orgs[0].slug).not.toBe(orgs[1].slug);
  });
  // Negative result: Failure due to honeypot
  it('should fail if honeypot is triggered', async () => {
    const res = await request(app)
      .post('/api/setup/create-organization-and-superadmin')
      .send({
        ...payload,
        contactFax: 'bot',
      });

    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(
      'Honeypot fields are defined. Bot detected.',
    );
  });
  // Negative result: Failure due to duration timer
  it('should fail if honeypot is triggered', async () => {
    const res = await request(app)
      .post('/api/setup/create-organization-and-superadmin')
      .send({
        ...payload,
        duration: 1000,
      });

    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(
      'Form submission was too fast. Possible bot.',
    );
  });
  // Negative result: Failure due to terms not accepted
  it('should fail if terms are not accepted', async () => {
    const res = await request(app)
      .post('/api/setup/create-organization-and-superadmin')
      .send({
        ...payload,
        acceptTerms: false,
      });

    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(
      'User must agree to the terms of service.',
    );
  });
  // Negative result: Validation fail with bad payload
  it('should fail validation for bad payload', async () => {
    const res = await request(app)
      .post('/api/setup/create-organization-and-superadmin')
      .send({
        ...payload,
        email: 'invalid',
      });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Validation failed');
  });
  // Negative result: Disposable email failure
  it('should fail for disposable email domains', async () => {
    const res = await request(app)
      .post('/api/setup/create-organization-and-superadmin')
      .send({
        ...payload,
        email: 'test@mailinator.com', // assuming in your blocklist
      });

    expect(res.status).toBe(403);
    expect(res.body.message).toMatch(
      'Request denied. Disposable email addresses are not allowed.',
    );
  });
  // Negative result: Prisma P2002 forced error
  it('should return 409 on unique constraint violation (P2002)', async () => {
    jest.spyOn(prisma.organization, 'create').mockRejectedValueOnce(
      new Prisma.PrismaClientKnownRequestError('Unique constraint failed', {
        code: 'P2002',
        clientVersion: 'test',
      }),
    );

    const res = await request(app)
      .post('/api/setup/create-organization-and-superadmin')
      .send(payload);

    expect(res.status).toBe(409);
  });
});
