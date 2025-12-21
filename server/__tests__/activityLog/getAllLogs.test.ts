import { describe, expect, afterAll, beforeAll, it } from '@jest/globals';
import request from 'supertest';

import {
  User,
  ActorTypeActivity,
  ActivityLog,
  Organization,
  OrganizationRole,
} from '@prisma/client';
import { app } from '../../src/app';
import { prismaTest } from '../../src/lib/prismaTestClient';
import { createOrganization } from '../../src/utilities/testUtilities/createOrganization';
import { createUserProfile } from '../../src/utilities/testUtilities/createUserProfile';
import { createActivityLog } from '../../src/utilities/testUtilities/createActivityLog';
import { resetTestDatabase } from '../../src/utilities/testUtilities/resetTestDatabase';
import { generateJwtToken } from '../../src/utilities/testUtilities/generateJwtToken';

describe('getAllLogs', () => {
  const testDescription = 'getAllLogs';
  let user: User;
  let token: string;
  let organization: Organization;

  beforeAll(async () => {
    await prismaTest.$connect();
    await resetTestDatabase();
    organization = await createOrganization(prismaTest, testDescription);
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
    await createActivityLog(
      prismaTest,
      testDescription,
      user.id,
      ActorTypeActivity.USER,
      1,
      'TICKET',
      1,
      organization.id
    );
    await createActivityLog(
      prismaTest,
      testDescription,
      user.id,
      ActorTypeActivity.USER,
      2,
      'BOARD',
      2,
      organization.id
    );
  });
  afterAll(async () => {
    await prismaTest.$disconnect();
  });

  it('should return all activity logs', async () => {
    const res = await request(app)
      .get('/api/activity-logs/all')
      .set('Authorization', `Bearer ${token}`);
    const logs: ActivityLog[] = res.body.data.filter((log: ActivityLog) =>
      ['TICKET_getAllLogs_1_UPDATE', 'BOARD_getAllLogs_2_UPDATE'].includes(
        log.action
      )
    );

    expect(res.status).toBe(200);
    expect(logs).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          userId: expect.any(Number),
          actorType: expect.any(String),
          action: 'TICKET_getAllLogs_1_UPDATE',
          targetId: expect.any(Number),
          targetType: expect.any(String),
          metadata: expect.objectContaining({ count: expect.any(Number) }),
        }),
        expect.objectContaining({
          userId: expect.any(Number),
          actorType: expect.any(String),
          action: 'BOARD_getAllLogs_2_UPDATE',
          targetId: expect.any(Number),
          targetType: expect.any(String),
          metadata: expect.objectContaining({ count: expect.any(Number) }),
        }),
      ])
    );
  });
});
