import { describe, expect, afterAll, beforeAll, it } from '@jest/globals';
import request from 'supertest';
import waitForExpect from 'wait-for-expect';

import {
  Board,
  GlobalRole,
  Project,
  Ticket,
  User,
  Comment,
  Attachment,
} from '@prisma/client';
import { app } from '../../src/app';
import { prismaTest } from '../../src/lib/prismaTestClient';
import { createUserProfile } from '../../src/utilities/testUtilities/createUserProfile';
import { createProject } from '../../src/utilities/testUtilities/createProject';
import { createBoard } from '../../src/utilities/testUtilities/createBoard';
import { createTicket } from '../../src/utilities/testUtilities/createTicket';
import { createComment } from '../../src/utilities/testUtilities/createComment';
import { createTestAttachment } from '../../src/utilities/testUtilities/createAttachments';
import { resetTestDatabase } from '../../src/utilities/testUtilities/resetTestDatabase';
import { generateJwtToken } from '../../src/utilities/testUtilities/generateJwtToken';

describe('Delete a user', () => {
  let token: string;
  let user1: User;
  let user2: User;
  let project: Project;
  let board: Board;
  let ticket: Ticket;
  let comment: Comment;
  let attachment: Attachment;

  const testDescription = 'deleteAUser';
  beforeAll(async () => {
    await prismaTest.$connect();
    await resetTestDatabase();
    user1 = await createUserProfile(
      prismaTest,
      testDescription,
      GlobalRole.ADMIN
    );
    user2 = await createUserProfile(
      prismaTest,
      testDescription,
      GlobalRole.USER
    );
    project = await createProject(prismaTest, testDescription, user1.id);
    project = { ...project, ownerId: user2.id };
    board = await createBoard(prismaTest, testDescription, project.id);
    ticket = await createTicket(
      prismaTest,
      testDescription,
      board.id,
      user2.id
    );
    comment = await createComment(
      prismaTest,
      testDescription,
      ticket.id,
      user2.id
    );
    attachment = await createTestAttachment(
      prismaTest,
      testDescription,
      comment.id,
      'COMMENT',
      user2.id,
      'jpg'
    );
    token = generateJwtToken(user1.id, user1.globalRole);
  });
  afterAll(async () => {
    await prismaTest.$disconnect();
  });

  it('should soft-delete a user', async () => {
    const res = await request(app)
      .patch(`/api/users/${user2.id}/soft-delete`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.message).toContain('Soft delete action successful');
    await waitForExpect(async () => {
      //User

      //projects
      const projectAfterDelete = await prismaTest.project.findUnique({
        where: { id: project.id },
      });

      expect(projectAfterDelete!.ownerId).toBe(null);

      //ticket
      const ticketAfterDelete = await prismaTest.ticket.findUnique({
        where: { id: ticket.id },
      });

      expect(ticketAfterDelete!.assigneeId).toBe(null);
      expect(ticketAfterDelete!.reporterId).toBe(null);

      //comment
      const commentAfterDelete = await prismaTest.comment.findUnique({
        where: { id: comment.id },
      });

      expect(commentAfterDelete!.authorId).toBe(null);

      //attachment
      const attachmentAfterDelete = await prismaTest.attachment.findUnique({
        where: { id: attachment.id },
      });

      expect(attachmentAfterDelete!.uploadedBy).toBe(null);
    });
  });
});
