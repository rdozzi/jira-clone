import { describe, expect, afterAll, beforeAll, it } from '@jest/globals';
import { existsSync, PathLike } from 'fs';
import request from 'supertest';
import dotenv from 'dotenv';

import {
  GlobalRole,
  User,
  ProjectRole,
  Ticket,
  Comment,
  AttachmentEntityType,
  Attachment,
} from '@prisma/client';
import { app } from '../../src/app';
import { prismaTest } from '../../src/lib/prismaTestClient';

import { resetTestDatabase } from '../../src/utilities/testUtilities/resetTestDatabase';
import { createUserProfile } from '../../src/utilities/testUtilities/createUserProfile';
import { createProject } from '../../src/utilities/testUtilities/createProject';
import { createBoard } from '../../src/utilities/testUtilities/createBoard';
import { createTicket } from '../../src/utilities/testUtilities/createTicket';
import { createComment } from '../../src/utilities/testUtilities/createComment';
import { createProjectMember } from '../../src/utilities/testUtilities/createProjectMember';
import { createTestAttachments } from '../../src/utilities/testUtilities/createAttachments';
import { generateJwtToken } from '../../src/utilities/testUtilities/generateJwtToken';

dotenv.config();

describe('handleSingleUpload', () => {
  const testDescription = 'handleSingleUpload';
  let attachments: Attachment[];
  let user1: User;
  let token: string;
  let ticket: Ticket | undefined;
  let comment: Comment;

  beforeAll(async () => {
    await prismaTest.$connect();
    await resetTestDatabase();
    user1 = await createUserProfile(
      prismaTest,
      `${testDescription}_user1`,
      GlobalRole.USER
    );
    token = generateJwtToken(user1.id, user1.globalRole);
    const project = await createProject(prismaTest, testDescription);
    const board = await createBoard(prismaTest, testDescription, project.id);
    ticket = await createTicket(
      prismaTest,
      testDescription,
      board.id,
      user1.id
    );
    comment = await createComment(
      prismaTest,
      testDescription,
      ticket.id,
      user1.id
    );
    await createProjectMember(
      prismaTest,
      project.id,
      user1.id,
      ProjectRole.USER
    );

    attachments = await createTestAttachments(
      3,
      prismaTest,
      testDescription,
      comment.id,
      AttachmentEntityType.COMMENT,
      user1.id
    );
  });

  it('should delete a single attachment', async () => {
    const attachmentIds = attachments.map((attachment) => {
      return attachment.id;
    });
    const res = await request(app)
      .delete(`/api/attachments`)
      .send({
        attachmentIds: attachmentIds,
        entityId: 1,
        entityType: 'COMMENT',
      })
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);

    for (const attachment of attachments) {
      const deletedAttachment = await prismaTest.attachment.findUnique({
        where: { id: attachment.id },
      });
      expect(deletedAttachment).toBeNull();
    }

    for (const attachment of attachments) {
      expect(existsSync(attachment.filePath as PathLike)).toBe(false);
    }
  });

  afterAll(async () => {
    await prismaTest.$disconnect();
  });
});
