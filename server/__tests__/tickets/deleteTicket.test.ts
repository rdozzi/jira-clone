import { describe, expect, afterAll, beforeAll, it } from '@jest/globals';
import request from 'supertest';
import waitForExpect from 'wait-for-expect';
// import fs from 'fs/promises';

import {
  Board,
  GlobalRole,
  Project,
  Ticket,
  User,
  Comment,
  Attachment,
  ProjectRole,
  Label,
} from '@prisma/client';
import { app } from '../../src/app';
import { prismaTest } from '../../src/lib/prismaTestClient';
import { createUserProfile } from '../../src/utilities/testUtilities/createUserProfile';
import { createProject } from '../../src/utilities/testUtilities/createProject';
import { createBoard } from '../../src/utilities/testUtilities/createBoard';
import { createTicket } from '../../src/utilities/testUtilities/createTicket';
import { createComment } from '../../src/utilities/testUtilities/createComment';
import { createTestAttachment } from '../../src/utilities/testUtilities/createAttachments';
import { createProjectMember } from '../../src/utilities/testUtilities/createProjectMember';
import { createTicketLabel } from '../../src/utilities/testUtilities/createTicketLabel';
import { createLabel } from '../../src/utilities/testUtilities/createLabel';
import { resetTestDatabase } from '../../src/utilities/testUtilities/resetTestDatabase';
import { generateJwtToken } from '../../src/utilities/testUtilities/generateJwtToken';

describe('Delete a ticket', () => {
  let token: string;
  let user: User;
  let project: Project;
  let board: Board;
  let ticket: Ticket;
  let comment1: Comment;
  let attachment: Attachment;
  let label1: Label;
  let label2: Label;

  const testDescription = 'deleteATicket';
  beforeAll(async () => {
    await prismaTest.$connect();
    await resetTestDatabase();
    user = await createUserProfile(
      prismaTest,
      testDescription,
      GlobalRole.USER
    );
    project = await createProject(prismaTest, testDescription, user.id);
    project = { ...project, ownerId: user.id };
    board = await createBoard(prismaTest, testDescription, project.id);
    ticket = await createTicket(prismaTest, testDescription, board.id, user.id);
    comment1 = await createComment(
      prismaTest,
      `${testDescription}_1`,
      ticket.id,
      user.id
    );

    // Comment 2
    await createComment(prismaTest, `${testDescription}_2`, ticket.id, user.id);

    attachment = await createTestAttachment(
      prismaTest,
      testDescription,
      comment1.id,
      'COMMENT',
      user.id,
      'jpg'
    );
    await createProjectMember(
      prismaTest,
      project.id,
      user.id,
      ProjectRole.USER
    );

    label1 = await createLabel(prismaTest, 'test label 1', '#AAA123');
    label2 = await createLabel(prismaTest, 'test label 2', '#E74C3C');

    await createTicketLabel(prismaTest, ticket.id, label1.id);
    await createTicketLabel(prismaTest, ticket.id, label2.id);
    token = generateJwtToken(user.id, user.globalRole);
  });

  it('should delete a ticket', async () => {
    const res = await request(app)
      .delete(`/api/tickets/${ticket.id}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      data: {
        id: expect.any(Number),
        title: expect.any(String),
        description: expect.any(String),
        boardId: expect.any(Number),
      },
      message: 'Ticket deleted successfully',
    });
    await waitForExpect(async () => {
      //comment
      const commentsAfterDelete = await prismaTest.comment.findMany({
        where: { ticketId: ticket.id },
      });
      expect(commentsAfterDelete).toHaveLength(0);

      //attachment
      const attachmentAfterDelete = await prismaTest.attachment.findUnique({
        where: { id: attachment.id },
      });
      expect(attachmentAfterDelete).toBeNull();

      //Ticket Label
      const ticketLabelPairsAfterDelete = await prismaTest.ticketLabel.findMany(
        { where: { ticketId: ticket.id } }
      );
      expect(ticketLabelPairsAfterDelete).toHaveLength(0);
    });
  });
  afterAll(async () => {
    await prismaTest.$disconnect();
  });
});
