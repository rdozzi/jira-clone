import { describe, expect, afterAll, beforeAll, it } from '@jest/globals';
import request from 'supertest';
import dotenv from 'dotenv';

import {
  User,
  ActorTypeActivity,
  OrganizationRole,
  Organization,
} from '@prisma/client';
import { app } from '../../src/app';
import { prismaTest } from '../../src/lib/prismaTestClient';
import { createOrganization } from '../../src/utilities/testUtilities/createOrganization';
import { createUserProfile } from '../../src/utilities/testUtilities/createUserProfile';
import { createActivityLog } from '../../src/utilities/testUtilities/createActivityLog';
import { createProject } from '../../src/utilities/testUtilities/createProject';
import { createBoard } from '../../src/utilities/testUtilities/createBoard';
import { createTicket } from '../../src/utilities/testUtilities/createTicket';
import { resetTestDatabase } from '../../src/utilities/testUtilities/resetTestDatabase';
import { generateJwtToken } from '../../src/utilities/testUtilities/generateJwtToken';

dotenv.config();

describe('getLogsByUserId', () => {
  const testDescription = 'getLogsByUserId';
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
    const project = await createProject(
      prismaTest,
      testDescription,
      user.id,
      organization.id
    );
    const board = await createBoard(
      prismaTest,
      testDescription,
      project.id,
      organization.id
    );
    const ticket = await createTicket(
      prismaTest,
      testDescription,
      board.id,
      user.id,
      organization.id
    );
    await createActivityLog(
      prismaTest,
      testDescription,
      user.id,
      ActorTypeActivity.USER,
      ticket.id,
      'TICKET',
      1,
      organization.id
    );
    await createActivityLog(
      prismaTest,
      testDescription,
      user.id,
      ActorTypeActivity.USER,
      ticket.id,
      'TICKET',
      2,
      organization.id
    );
  });
  afterAll(async () => {
    await prismaTest.$disconnect();
  });

  it('should return all activity logs by the userId', async () => {
    const res = await request(app)
      .get(`/api/activity-logs/${user.id}/user`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.data[0]).toHaveProperty('action');
    expect(res.body.data).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          userId: expect.any(Number),
          actorType: expect.any(String),
          action: 'TICKET_getLogsByUserId_1_UPDATE',
          targetId: expect.any(Number),
          targetType: expect.any(String),
          metadata: expect.objectContaining({ count: expect.any(Number) }),
        }),
        expect.objectContaining({
          userId: expect.any(Number),
          actorType: expect.any(String),
          action: 'TICKET_getLogsByUserId_2_UPDATE',
          targetId: expect.any(Number),
          targetType: expect.any(String),
          metadata: expect.objectContaining({ count: expect.any(Number) }),
        }),
      ])
    );
  });
});
