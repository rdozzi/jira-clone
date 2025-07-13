import { describe, expect, afterAll, beforeAll, it } from '@jest/globals';
import request from 'supertest';

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

describe('Add label to Ticket', () => {
  let token: string;
  let user: User;
  let ticket: Ticket;
  let label: Label;
  const testDescription = 'Add label to Ticket';
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

  it('should add a label to a ticket', async () => {
    const res = await request(app)
      .post(`/api/ticket-labels/${ticket.id}/${label.id}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(201);
    expect(res.body).toEqual({
      ticketLabelPair: {
        ticketId: ticket.id,
        labelId: label.id,
      },
      message: 'Label addition to ticket successful',
    });
  });
});
