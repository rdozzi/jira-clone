import { describe, expect, afterAll, beforeAll, it } from '@jest/globals';
import { existsSync, PathLike } from 'fs';
import request from 'supertest';
import dotenv from 'dotenv';

import {
  OrganizationRole,
  Organization,
  User,
  ProjectRole,
  Ticket,
  Comment,
  AttachmentEntityType,
  Attachment,
} from '@prisma/client';
import { app } from '../../src/app';
import { prismaTest } from '../../src/lib/prismaTestClient';
import { createOrganization } from '../../src/utilities/testUtilities/createOrganization';
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

describe('deleteManyAttachments', () => {
  const testDescription = 'deleteManyAttachments';
  let attachments: Attachment[];
  let user1: User;
  let token: string;
  let ticket: Ticket | undefined;
  let comment: Comment;
  let organization: Organization;

  beforeAll(async () => {
    await prismaTest.$connect();
    await resetTestDatabase();
    organization = await createOrganization(prismaTest, testDescription);
    user1 = await createUserProfile(
      prismaTest,
      `${testDescription}_user1`,
      OrganizationRole.USER,
      organization.id
    );
    token = generateJwtToken(
      user1.id,
      user1.globalRole,
      user1.organizationId,
      user1.organizationRole
    );
    const project = await createProject(
      prismaTest,
      testDescription,
      user1.id,
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
      user1.id,
      organization.id
    );
    comment = await createComment(
      prismaTest,
      testDescription,
      ticket.id,
      user1.id,
      organization.id
    );
    await createProjectMember(
      prismaTest,
      project.id,
      user1.id,
      ProjectRole.USER,
      organization.id
    );

    attachments = await createTestAttachments(
      3,
      prismaTest,
      testDescription,
      comment.id,
      AttachmentEntityType.COMMENT,
      user1.id,
      'pdf',
      organization.id
    );
  });

  it('should delete many attachments', async () => {
    const attachmentIds = attachments.map((attachment) => {
      return attachment.id;
    });
    const res = await request(app)
      .delete(`/api/attachments`)
      .send({
        attachmentIds: attachmentIds,
        entityId: comment.id,
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
