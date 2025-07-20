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
import { createTicketLabel } from '../../src/utilities/testUtilities/createTicketLabel';

describe('Get Label by Ticket Id', () => {
  let token: string;
  let user: User;
  let ticket1: Ticket;
  let ticket2: Ticket;
  let label1: Label;
  let label2: Label;
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
    const project = await createProject(prismaTest, testDescription, user.id);
    const board = await createBoard(prismaTest, testDescription, project.id);
    ticket1 = await createTicket(
      prismaTest,
      testDescription,
      board.id,
      user.id
    );
    ticket2 = await createTicket(
      prismaTest,
      testDescription,
      board.id,
      user.id
    );
    label1 = await createLabel(prismaTest, 'label', '#FF0000');
    label2 = await createLabel(prismaTest, 'label', '#C3E73C');
    await createTicketLabel(prismaTest, ticket1.id, label1.id);
    await createTicketLabel(prismaTest, ticket2.id, label1.id);
    await createTicketLabel(prismaTest, ticket2.id, label2.id);
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

  it('should get a label from a ticket', async () => {
    const res = await request(app)
      .get(`/api/ticket-labels/${ticket1.id}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body).toEqual(
      expect.objectContaining({
        message: 'Label fetch successful (Note: Might be empty)',
        ticketLabelPair: expect.arrayContaining([
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
      'Label fetch successful (Note: Might be empty)'
    );
    expect(res.body.ticketLabelPair).toHaveLength(2);
  });
});
