import { describe, expect, afterAll, beforeAll, it } from '@jest/globals';
import request from 'supertest';

import { OrganizationRole, Organization, User, Ticket } from '@prisma/client';
import { app } from '../../src/app';
import { prismaTest } from '../../src/lib/prismaTestClient';
import { createOrganization } from '../../src/utilities/testUtilities/createOrganization';
import { resetTestDatabase } from '../../src/utilities/testUtilities/resetTestDatabase';
import { createUserProfile } from '../../src/utilities/testUtilities/createUserProfile';
import { createProject } from '../../src/utilities/testUtilities/createProject';
import { createBoard } from '../../src/utilities/testUtilities/createBoard';
import { createTicket } from '../../src/utilities/testUtilities/createTicket';
import { createComment } from '../../src/utilities/testUtilities/createComment';
import { generateJwtToken } from '../../src/utilities/testUtilities/generateJwtToken';

describe('Get all comments', () => {
  let token: string;
  let user: User;
  let ticket: Ticket;
  let organization: Organization;
  const testDescription = 'getAllComments';
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
    ticket = await createTicket(
      prismaTest,
      `${testDescription}_1`,
      board.id,
      user.id,
      organization.id
    );
    await createComment(
      prismaTest,
      `${testDescription}_1`,
      ticket.id,
      user.id,
      organization.id
    );
    await createComment(
      prismaTest,
      `${testDescription}_2`,
      ticket.id,
      user.id,
      organization.id
    );
  });
  afterAll(async () => {
    await prismaTest.$disconnect();
  });

  it('should get all comments', async () => {
    const res = await request(app)
      .get(`/api/comments`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.message).toEqual('Comments were fetched successfully');
    expect(res.body.data).toHaveLength(2);
  });
});
