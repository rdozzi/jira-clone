import { describe, expect, afterAll, beforeAll, it } from '@jest/globals';
import request from 'supertest';

import { User, OrganizationRole, Organization } from '@prisma/client';
import { app } from '../../src/app';
import { prismaTest } from '../../src/lib/prismaTestClient';
import { createOrganization } from '../../src/utilities/testUtilities/createOrganization';
import { createUserProfile } from '../../src/utilities/testUtilities/createUserProfile';
import { resetTestDatabase } from '../../src/utilities/testUtilities/resetTestDatabase';
import { createOrgCountRecords } from '../../src/utilities/testUtilities/createOrgCountRecords';
import { generateJwtToken } from '../../src/utilities/testUtilities/generateJwtToken';
import waitForExpect from 'wait-for-expect';

describe('Logout Auth Route', () => {
  const testDescription = 'Logout_User_Auth_Route';
  let user: User;
  // let userNoToken: User;
  let organization: Organization;
  let token: string;
  beforeAll(async () => {
    await prismaTest.$connect();
    await resetTestDatabase();
    organization = await createOrganization(prismaTest, testDescription);
    await createOrgCountRecords(prismaTest, organization.id);
    user = await createUserProfile(
      prismaTest,
      testDescription,
      OrganizationRole.ADMIN,
      organization.id,
    );
    // userNoToken = await createUserProfile(
    //   prismaTest,
    //   `${testDescription}-NoToken`,
    //   OrganizationRole.USER,
    //   organization.id,
    // );
    token = generateJwtToken(
      user.id,
      user.globalRole,
      user.organizationId,
      user.organizationRole,
    );
  });
  afterAll(async () => {
    await prismaTest.$disconnect();
  });

  // Positive Result:
  // 1) Successful logout. Generate log.
  it('should log out successfully with token', async () => {
    const res = await request(app)
      .post('/api/auth/logout')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Logout successful');

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
          timestamp: expect.any(String),
        }),
        createdAt: expect.any(Date),
        organizationId: expect.any(Number),
      });
    });
  });

  // Negative Results:
  // 1) Unsuccessful Logout: No token
  it('logout should fail without a token', async () => {
    const res = await request(app).post('/api/auth/logout');

    console.log('error', res.body.error, 'message', res.body.message);
    expect(res.status).toBe(401);
    expect(res.body.error).toBe('No token provided');
  });
});
