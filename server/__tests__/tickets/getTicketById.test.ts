import { describe, expect, afterAll, beforeAll, it } from '@jest/globals';
import request from 'supertest';

import {
  User,
  OrganizationRole,
  Organization,
  Ticket,
  ProjectRole,
} from '@prisma/client';
import { app } from '../../src/app';
import { prismaTest } from '../../src/lib/prismaTestClient';
import { createOrganization } from '../../src/utilities/testUtilities/createOrganization';
import { createUserProfile } from '../../src/utilities/testUtilities/createUserProfile';
import { createProject } from '../../src/utilities/testUtilities/createProject';
import { createBoard } from '../../src/utilities/testUtilities/createBoard';
import { createTicket } from '../../src/utilities/testUtilities/createTicket';
import { createProjectMember } from '../../src/utilities/testUtilities/createProjectMember';
import { resetTestDatabase } from '../../src/utilities/testUtilities/resetTestDatabase';
import { generateJwtToken } from '../../src/utilities/testUtilities/generateJwtToken';

describe('Get ticket by Id', () => {
  let token: string;
  let user: User;
  let ticket1: Ticket;
  let organization: Organization;
  const testDescription = 'getTicketById';
  beforeAll(async () => {
    await prismaTest.$connect();
    await resetTestDatabase();
    organization = await createOrganization(prismaTest, testDescription);
    user = await createUserProfile(
      prismaTest,
      `${testDescription}_1`,
      OrganizationRole.ADMIN,
      organization.id
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
    ticket1 = await createTicket(
      prismaTest,
      `${testDescription}_1`,
      board.id,
      user.id,
      organization.id
    );
    await createProjectMember(
      prismaTest,
      project.id,
      user.id,
      ProjectRole.ADMIN,
      organization.id
    );
    token = generateJwtToken(
      user.id,
      user.globalRole,
      user.organizationId,
      user.organizationRole
    );
  });
  afterAll(async () => {
    await prismaTest.$disconnect();
  });
  it('should get a ticket by its id', async () => {
    const res = await request(app)
      .get(`/api/tickets/${ticket1.id}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Ticket fetched successfully');
    expect(res.body.data).toEqual({
      assignee: {
        firstName: expect.any(String),
        lastName: expect.any(String),
      },
      id: expect.any(Number),
      title: expect.any(String),
      description: expect.any(String),
      status: expect.any(String),
      priority: expect.any(String),
      type: expect.any(String),
      assigneeId: expect.any(Number),
      reporterId: expect.any(Number),
      boardId: expect.any(Number),
      dueDate: null,
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
      organizationId: expect.any(Number),
    });
  });
});
