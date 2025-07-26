import { describe, expect, afterAll, beforeAll, it } from '@jest/globals';
import request from 'supertest';

import {
  OrganizationRole,
  Organization,
  Ticket,
  User,
  Label,
  ProjectRole,
} from '@prisma/client';
import { app } from '../../src/app';
import { prismaTest } from '../../src/lib/prismaTestClient';
import { createOrganization } from '../../src/utilities/testUtilities/createOrganization';
import { createUserProfile } from '../../src/utilities/testUtilities/createUserProfile';
import { createProject } from '../../src/utilities/testUtilities/createProject';
import { createBoard } from '../../src/utilities/testUtilities/createBoard';
import { createTicket } from '../../src/utilities/testUtilities/createTicket';
import { createLabel } from '../../src/utilities/testUtilities/createLabel';
import { createProjectMember } from '../../src/utilities/testUtilities/createProjectMember';
import { resetTestDatabase } from '../../src/utilities/testUtilities/resetTestDatabase';
import { generateJwtToken } from '../../src/utilities/testUtilities/generateJwtToken';
import { createTicketLabel } from '../../src/utilities/testUtilities/createTicketLabel';

describe('Get Label by Ticket Id', () => {
  let token: string;
  let user: User;
  let ticket1: Ticket;
  let ticket2: Ticket;
  let label1: Label;
  let label2: Label;
  let organization: Organization;
  const testDescription = 'Get Label by Ticket Id';

  beforeAll(async () => {
    await prismaTest.$connect();
    await resetTestDatabase();
    organization = await createOrganization(prismaTest, testDescription);
    user = await createUserProfile(
      prismaTest,
      testDescription,
      OrganizationRole.USER,
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
    ticket1 = await createTicket(
      prismaTest,
      testDescription,
      board.id,
      user.id,
      organization.id
    );
    ticket2 = await createTicket(
      prismaTest,
      testDescription,
      board.id,
      user.id,
      organization.id
    );
    label1 = await createLabel(prismaTest, 'label', '#FF0000', organization.id);
    label2 = await createLabel(prismaTest, 'label', '#C3E73C', organization.id);
    await createTicketLabel(prismaTest, ticket1.id, label1.id, organization.id);
    await createTicketLabel(prismaTest, ticket2.id, label1.id, organization.id);
    await createTicketLabel(prismaTest, ticket2.id, label2.id, organization.id);
    await createProjectMember(
      prismaTest,
      project.id,
      user.id,
      ProjectRole.USER,
      organization.id
    );
  });
  afterAll(async () => {
    await prismaTest.$disconnect();
  });

  it('should get a label from a ticket', async () => {
    const res = await request(app)
      .get(`/api/ticket-labels/${ticket1.id}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body).toEqual(
      expect.objectContaining({
        message: 'Label fetched successfully (Note: Might be empty)',
        data: expect.arrayContaining([
          { ticketId: expect.any(Number), labelId: expect.any(Number) },
        ]),
      })
    );
  });

  it('should get many labels from a ticket', async () => {
    const res = await request(app)
      .get(`/api/ticket-labels/${ticket2.id}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.message).toEqual(
      'Label fetched successfully (Note: Might be empty)'
    );
    expect(res.body.data).toHaveLength(2);
  });
});
