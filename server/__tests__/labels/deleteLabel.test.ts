import { describe, expect, afterAll, beforeAll, it } from '@jest/globals';
import request from 'supertest';
import waitForExpect from 'wait-for-expect';

import { GlobalRole, Ticket, User, Label, TicketLabel } from '@prisma/client';
import { app } from '../../src/app';
import { prismaTest } from '../../src/lib/prismaTestClient';
import { createUserProfile } from '../../src/utilities/testUtilities/createUserProfile';
import { createProject } from '../../src/utilities/testUtilities/createProject';
import { createBoard } from '../../src/utilities/testUtilities/createBoard';
import { createTicket } from '../../src/utilities/testUtilities/createTicket';
import { createLabel } from '../../src/utilities/testUtilities/createLabel';
import { createTicketLabel } from '../../src/utilities/testUtilities/createTicketLabel';
import { resetTestDatabase } from '../../src/utilities/testUtilities/resetTestDatabase';
import { generateJwtToken } from '../../src/utilities/testUtilities/generateJwtToken';

describe('Delete label with deletion cascade', () => {
  let token: string;
  let user: User;
  let ticket: Ticket;
  let label: Label;
  let ticketLabelRecords: TicketLabel[];
  const testDescription = 'Delete label with deletion cascade';
  beforeAll(async () => {
    await prismaTest.$connect();
    await resetTestDatabase();
    user = await createUserProfile(
      prismaTest,
      testDescription,
      GlobalRole.ADMIN
    );
    token = generateJwtToken(user.id, user.globalRole);
    const project = await createProject(prismaTest, testDescription);
    const board = await createBoard(prismaTest, testDescription, project.id);
    ticket = await createTicket(prismaTest, testDescription, board.id, user.id);
    label = await createLabel(prismaTest, 'label', '#FF0000');
    await createTicketLabel(prismaTest, ticket.id, label.id);
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
      deletedLabel: {
        id: expect.any(Number),
        name: `label`, // Hard-coded to satisfy test purposes
        color: '#FF0000',
        createdAt: expect.any(String),
      },
      message: 'Label successfully deleted',
    });

    await waitForExpect(async () => {
      ticketLabelRecords = await prismaTest.ticketLabel.findMany({
        where: { labelId: label.id },
      });

      expect(ticketLabelRecords).toHaveLength(0);
    });
  });
});
