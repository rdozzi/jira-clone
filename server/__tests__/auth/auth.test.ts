import { describe, expect, afterAll, beforeAll, it } from '@jest/globals';
import request from 'supertest';

import { User, OrganizationRole, Organization } from '@prisma/client';
import { app } from '../../src/app';
import { prismaTest } from '../../src/lib/prismaTestClient';
import { createOrganization } from '../../src/utilities/testUtilities/createOrganization';
import { createUserProfile } from '../../src/utilities/testUtilities/createUserProfile';
import { resetTestDatabase } from '../../src/utilities/testUtilities/resetTestDatabase';
import { createOrgCountRecords } from '../../src/utilities/testUtilities/createOrgCountRecords';
import waitForExpect from 'wait-for-expect';

// Positive Result:
// 1) Successful Login: Create credential, use credential to log in.
// Negative Result:
// 1) Failed Login: Enter wrong password for test user
// 2) Failed Login: Enter wrong information for non-exisent user

describe('Login Auth Route', () => {
  const testDescription = 'Login_Auth_Route';
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
      OrganizationRole.ADMIN,
      organization.id
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
    expect(res.body).toMatchObject({
      message: 'Login successful',
      userId: expect.any(Number),
      email: expect.any(String),
      globalRole: expect.any(String),
      organizationRole: expect.any(String),
      organizationId: expect.any(Number),
      token: expect.any(String),
    });

    await waitForExpect(async () => {
      const activityLog = await prismaTest.activityLog.findMany({
        where: { organizationId: organization.id },
      });
      expect(activityLog.length).toBe(1);
      expect(activityLog[0]).toEqual({
        id: expect.any(Number),
        userId: expect.any(Number),
        actorType: expect.any(String),
        action: expect.any(String),
        targetId: expect.any(Number),
        targetType: expect.any(String),
        metadata: expect.objectContaining({
          id: expect.any(Number),
          name: expect.any(String),
          email: expect.any(String),
          globalRole: expect.any(String),
          organizationRole: expect.any(String),
          timestamp: expect.any(String),
        }),
        createdAt: expect.any(Date),
        organizationId: expect.any(Number),
      });
    });
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
