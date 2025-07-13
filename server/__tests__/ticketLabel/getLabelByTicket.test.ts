import { describe, expect, afterAll, beforeAll, it } from '@jest/globals';
import request from 'supertest';
import waitForExpect from 'wait-for-expect';

import { GlobalRole, Ticket, User, Label, ProjectRole } from '@prisma/client';
import { app } from '../../src/app';
import { prismaTest } from '../../src/lib/prismaTestClient';
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
  let ticket: Ticket;
  let label: Label;
  const testDescription = 'Get Label by Ticket Id';
  beforeAll(async () => {
    await prismaTest.$connect();
    await resetTestDatabase();
    user = await createUserProfile(
      prismaTest,
      testDescription,
      GlobalRole.USER
    );
    token = generateJwtToken(user.id, user.globalRole);
    const project = await createProject(prismaTest, testDescription);
    const board = await createBoard(prismaTest, testDescription, project.id);
    ticket = await createTicket(prismaTest, testDescription, board.id, user.id);
    label = await createLabel(prismaTest, 'label', '#FF0000');
    await createTicketLabel(prismaTest, ticket.id, label.id);
    await createProjectMember(
      prismaTest,
      project.id,
      user.id,
      ProjectRole.USER
    );
  });
  afterAll(async () => {
    await prismaTest.$disconnect();
  });

  it('should delete a label from a ticket', async () => {
    const res = await request(app)
      .get(`/api/ticket-labels/${ticket.id}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      removedTicketLabel: {
        ticketId: ticket.id,
        labelId: label.id,
      },
      message: 'Label remove successful',
    });

    await waitForExpect(async () => {
      const ticketLabelRecord = await prismaTest.ticketLabel.findUnique({
        where: { ticketId_labelId: { ticketId: ticket.id, labelId: label.id } },
      });

      expect(ticketLabelRecord).toBeNull();
    });
  });
});
