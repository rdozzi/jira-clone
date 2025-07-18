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
  TicketLabel,
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

describe('Delete a board', () => {
  let token: string;
  let user: User;
  let project: Project;
  let board1: Board;
  let board2: Board;
  let ticket1: Ticket;
  let ticket2: Ticket;
  let ticket3: Ticket;
  let comment1: Comment;
  let comment2: Comment;
  let attachment1: Attachment;
  let attachment2: Attachment;
  let attachment3: Attachment;
  let attachment4: Attachment;
  let label1: Label;
  let label2: Label;
  let ticketLabelPairsAfterDelete1: TicketLabel | null;
  let ticketLabelPairsAfterDelete2: TicketLabel | null;

  const testDescription = 'deleteABoard';
  beforeAll(async () => {
    await prismaTest.$connect();
    await resetTestDatabase();
    user = await createUserProfile(
      prismaTest,
      testDescription,
      GlobalRole.USER
    );
    project = await createProject(prismaTest, testDescription, user.id);
    board1 = await createBoard(prismaTest, `${testDescription}_1`, project.id);
    board2 = await createBoard(prismaTest, `${testDescription}_2`, project.id);
    ticket1 = await createTicket(
      prismaTest,
      testDescription,
      board1.id,
      user.id
    );
    ticket2 = await createTicket(
      prismaTest,
      testDescription,
      board2.id,
      user.id
    );
    ticket3 = await createTicket(
      prismaTest,
      testDescription,
      board2.id,
      user.id
    );
    comment1 = await createComment(
      prismaTest,
      `${testDescription}_1`,
      ticket1.id,
      user.id
    );

    // Comment 2
    comment2 = await createComment(
      prismaTest,
      `${testDescription}_2`,
      ticket2.id,
      user.id
    );

    attachment1 = await createTestAttachment(
      prismaTest,
      `${testDescription}_Attachment_1`,
      comment1.id,
      'COMMENT',
      user.id,
      'jpg'
    );

    attachment2 = await createTestAttachment(
      prismaTest,
      `${testDescription}_Attachment_2`,
      ticket1.id,
      'TICKET',
      user.id,
      'pdf'
    );

    attachment3 = await createTestAttachment(
      prismaTest,
      `${testDescription}_Attachment_3`,
      board1.id,
      'BOARD',
      user.id,
      'png'
    );

    attachment4 = await createTestAttachment(
      prismaTest,
      `${testDescription}_Attachment_4`,
      board1.id,
      'PROJECT',
      user.id,
      'png'
    );

    await createProjectMember(
      prismaTest,
      project.id,
      user.id,
      ProjectRole.ADMIN
    );

    label1 = await createLabel(prismaTest, 'test label 1', '#AAA123');
    label2 = await createLabel(prismaTest, 'test label 2', '#E74C3C');

    await createTicketLabel(prismaTest, ticket1.id, label1.id);
    await createTicketLabel(prismaTest, ticket2.id, label2.id);
    token = generateJwtToken(user.id, user.globalRole);
  });

  it('should delete a project and all of its dependencies', async () => {
    const res = await request(app)
      .delete(`/api/projects/${project.id}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      data: {
        id: expect.any(Number),
        name: expect.any(String),
        ownerId: expect.any(Number),
        description: expect.any(String),
        status: expect.any(String),
        isPublic: expect.any(Boolean),
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      },
      message: 'Project deleted successfully',
    });
    await waitForExpect(async () => {
      //board1
      const board1AfterDelete = await prismaTest.board.findUnique({
        where: { id: board1.id },
      });

      expect(board1AfterDelete).toBeNull();

      //board2
      const board2AfterDelete = await prismaTest.board.findUnique({
        where: { id: board1.id },
      });

      expect(board2AfterDelete).toBeNull();

      //ticket1
      const ticket1AfterDelete = await prismaTest.ticket.findUnique({
        where: { id: ticket1.id },
      });
      expect(ticket1AfterDelete).toBeNull();

      //ticket2
      const ticket2AfterDelete = await prismaTest.ticket.findUnique({
        where: { id: ticket2.id },
      });
      expect(ticket2AfterDelete).toBeNull();

      //ticket3
      const ticket3AfterDelete = await prismaTest.ticket.findUnique({
        where: { id: ticket3.id },
      });
      expect(ticket3AfterDelete).toBeNull();

      //comment1
      const comment1AfterDelete = await prismaTest.comment.findUnique({
        where: { id: comment1.id },
      });
      expect(comment1AfterDelete).toBeNull();

      //comment2
      const comment2AfterDelete = await prismaTest.comment.findUnique({
        where: { id: comment2.id },
      });
      expect(comment2AfterDelete).toBeNull();

      //attachment1
      const attachmentAfterDelete1 = await prismaTest.attachment.findUnique({
        where: { id: attachment1.id },
      });
      expect(attachmentAfterDelete1).toBeNull();

      //attachment2
      const attachmentAfterDelete2 = await prismaTest.attachment.findUnique({
        where: { id: attachment2.id },
      });
      expect(attachmentAfterDelete2).toBeNull();

      //attachment3
      const attachmentAfterDelete3 = await prismaTest.attachment.findUnique({
        where: { id: attachment3.id },
      });
      expect(attachmentAfterDelete3).toBeNull();

      //attachment4
      const attachmentAfterDelete4 = await prismaTest.attachment.findUnique({
        where: { id: attachment4.id },
      });
      expect(attachmentAfterDelete4).toBeNull();

      //Ticket Label 1
      ticketLabelPairsAfterDelete1 = await prismaTest.ticketLabel.findUnique({
        where: {
          ticketId_labelId: { ticketId: ticket1.id, labelId: label1.id },
        },
      });
      expect(ticketLabelPairsAfterDelete1).toBeNull();

      //Ticket Label 2
      ticketLabelPairsAfterDelete2 = await prismaTest.ticketLabel.findUnique({
        where: {
          ticketId_labelId: { ticketId: ticket2.id, labelId: label2.id },
        },
      });
      expect(ticketLabelPairsAfterDelete2).toBeNull();
    });
  });
  afterAll(async () => {
    await prismaTest.$disconnect();
  });
});
