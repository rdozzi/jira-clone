import { describe, expect, afterAll, beforeAll, it } from '@jest/globals';
import request from 'supertest';
import waitForExpect from 'wait-for-expect';

import {
  OrganizationRole,
  Organization,
  Ticket,
  User,
  Label,
  TicketLabel,
} from '@prisma/client';
import { app } from '../../src/app';
import { prismaTest } from '../../src/lib/prismaTestClient';
import { createOrganization } from '../../src/utilities/testUtilities/createOrganization';
import { createUserProfile } from '../../src/utilities/testUtilities/createUserProfile';
import { createProject } from '../../src/utilities/testUtilities/createProject';
import { createBoard } from '../../src/utilities/testUtilities/createBoard';
import { createTicket } from '../../src/utilities/testUtilities/createTicket';
import { createLabel } from '../../src/utilities/testUtilities/createLabel';
import { createTicketLabel } from '../../src/utilities/testUtilities/createTicketLabel';
import { resetTestDatabase } from '../../src/utilities/testUtilities/resetTestDatabase';
import { generateJwtToken } from '../../src/utilities/testUtilities/generateJwtToken';
import { createOrgCountRecords } from '../../src/utilities/testUtilities/createOrgCountRecords';

describe('Delete label with deletion cascade', () => {
  let token: string;
  let user: User;
  let ticket: Ticket;
  let label: Label;
  let ticketLabelRecords: TicketLabel[];
  let organization: Organization;
  const testDescription = 'Delete label with deletion cascade';
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
      testDescription,
      board.id,
      user.id,
      organization.id
    );
    label = await createLabel(prismaTest, 'label', '#FF0000', organization.id);
    await createTicketLabel(prismaTest, ticket.id, label.id, organization.id);
  });
  afterAll(async () => {
    await prismaTest.$disconnect();
  });

  it('should delete a label', async () => {
    const res = await request(app)
      .delete(`/api/labels/${label.id}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      data: {
        id: expect.any(Number),
        name: `label`, // Hard-coded to satisfy test purposes
        color: '#FF0000',
        createdAt: expect.any(String),
        organizationId: expect.any(Number),
      },
      message: 'Label deleted successfully',
    });

    await waitForExpect(async () => {
      ticketLabelRecords = await prismaTest.ticketLabel.findMany({
        where: { labelId: label.id },
      });

      expect(ticketLabelRecords).toHaveLength(0);
    });
  });
});
