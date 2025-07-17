import { describe, expect, afterAll, beforeAll, it } from '@jest/globals';
import request from 'supertest';
import dotenv from 'dotenv';

import {
  GlobalRole,
  User,
  ProjectRole,
  ActorTypeActivity,
  Ticket,
} from '@prisma/client';
import { app } from '../../src/app';
import { prismaTest } from '../../src/lib/prismaTestClient';

import { resetTestDatabase } from '../../src/utilities/testUtilities/resetTestDatabase';
import { createUserProfile } from '../../src/utilities/testUtilities/createUserProfile';
import { createProject } from '../../src/utilities/testUtilities/createProject';
import { createBoard } from '../../src/utilities/testUtilities/createBoard';
import { createTicket } from '../../src/utilities/testUtilities/createTicket';
import { createProjectMember } from '../../src/utilities/testUtilities/createProjectMember';
import { createActivityLog } from '../../src/utilities/testUtilities/createActivityLog';
import { generateJwtToken } from '../../src/utilities/testUtilities/generateJwtToken';

dotenv.config();

describe('getLogByTicketId', () => {
  const testDescription = 'getLogByTicketId';
  let user: User;
  let token: string;
  let ticket: Ticket | undefined;

  beforeAll(async () => {
    await prismaTest.$connect();
    await resetTestDatabase();
    user = await createUserProfile(
      prismaTest,
      testDescription,
      GlobalRole.USER
    );
    token = generateJwtToken(user.id, user.globalRole);
    const project = await createProject(prismaTest, testDescription, user.id);
    const board = await createBoard(prismaTest, testDescription, project.id);
    ticket = await createTicket(prismaTest, testDescription, board.id, user.id);
    await createProjectMember(
      prismaTest,
      project.id,
      user.id,
      ProjectRole.VIEWER
    );
    await createActivityLog(
      prismaTest,
      testDescription,
      user.id,
      ActorTypeActivity.USER,
      ticket.id,
      'TICKET',
      1
    );
    await createActivityLog(
      prismaTest,
      testDescription,
      user.id,
      ActorTypeActivity.USER,
      ticket.id,
      'TICKET',
      2
    );
  });
  afterAll(async () => {
    await prismaTest.$disconnect();
  });

  it('should return all activity logs for ticket', async () => {
    const res = await request(app)
      .get(`/api/activity-logs/${ticket?.id}/ticket`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body[0]).toHaveProperty('action');
    expect(res.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          userId: expect.any(Number),
          actorType: expect.any(String),
          action: 'TICKET_getLogByTicketId_1',
          targetId: expect.any(Number),
          targetType: expect.any(String),
          metadata: expect.objectContaining({ count: expect.any(Number) }),
        }),
        expect.objectContaining({
          userId: expect.any(Number),
          actorType: expect.any(String),
          action: 'TICKET_getLogByTicketId_2',
          targetId: expect.any(Number),
          targetType: expect.any(String),
          metadata: expect.objectContaining({ count: expect.any(Number) }),
        }),
      ])
    );
  });
});
