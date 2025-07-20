import { describe, expect, afterAll, beforeAll, it } from '@jest/globals';
import request from 'supertest';

import {
  GlobalRole,
  User,
  ProjectRole,
  Ticket,
  Comment,
  AttachmentEntityType,
} from '@prisma/client';
import { app } from '../../src/app';
import { prismaTest } from '../../src/lib/prismaTestClient';

import { resetTestDatabase } from '../../src/utilities/testUtilities/resetTestDatabase';
import { createUserProfile } from '../../src/utilities/testUtilities/createUserProfile';
import { createProject } from '../../src/utilities/testUtilities/createProject';
import { createBoard } from '../../src/utilities/testUtilities/createBoard';
import { createTicket } from '../../src/utilities/testUtilities/createTicket';
import { createComment } from '../../src/utilities/testUtilities/createComment';
import { createTestAttachment } from '../../src/utilities/testUtilities/createAttachments';
import { createProjectMember } from '../../src/utilities/testUtilities/createProjectMember';
import { generateJwtToken } from '../../src/utilities/testUtilities/generateJwtToken';

describe('Create a comment', () => {
  let token: string;
  let user: User;
  let ticket: Ticket;
  let comment: Comment;
  const testDescription = 'createAComment';
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
    ticket = await createTicket(prismaTest, testDescription, board.id, user.id);
    comment = await createComment(
      prismaTest,
      testDescription,
      ticket.id,
      user.id
    );
    await createTestAttachment(
      prismaTest,
      testDescription,
      comment.id,
      AttachmentEntityType.COMMENT,
      user.id,
      'pdf'
    );
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

  it('should add a comment to a ticket', async () => {
    const res = await request(app)
      .post(`/api/comments`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        ticketId: ticket.id,
        content: `Create comment for ${testDescription}`,
      });
    expect(res.status).toBe(200);
    expect(res.body).toEqual(
      expect.objectContaining({
        comment: {
          id: expect.any(Number),
          ticketId: expect.any(Number),
          authorId: expect.any(Number),
          content: expect.any(String),
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        },
        message: expect.any(String),
      })
    );
  });
  it('should reject a comment with bad language', async () => {
    const res = await request(app)
      .post(`/api/comments`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        ticketId: ticket.id,
        content: `This word is in the banned list: voyeur`,
      });
    expect(res.status).toBe(400);
  });
});
