import { describe, expect, afterAll, beforeAll, it } from '@jest/globals';
import { unlink } from 'fs/promises';
import request from 'supertest';
import dotenv from 'dotenv';

import {
  Organization,
  OrganizationRole,
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
import { createTestAttachment } from '../../src/utilities/testUtilities/createAttachments';
import { generateJwtToken } from '../../src/utilities/testUtilities/generateJwtToken';

dotenv.config();

describe('getAllAttachment', () => {
  const testDescription = 'getAllAttachments';
  let attachment1: Attachment;
  let attachment2: Attachment;
  let user1: User;
  let user2: User;
  let user3: User;
  let tokenUser1: string;
  let tokenUser3: string;
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
      OrganizationRole.ADMIN,
      organization.id
    );

    user2 = await createUserProfile(
      prismaTest,
      `${testDescription}_user2`,
      OrganizationRole.USER,
      organization.id
    );

    user3 = await createUserProfile(
      prismaTest,
      `${testDescription}_user3`,
      OrganizationRole.USER,
      organization.id
    );

    tokenUser1 = generateJwtToken(
      user1.id,
      user1.globalRole,
      user1.organizationId,
      user1.organizationRole
    );
    tokenUser3 = generateJwtToken(
      user2.id,
      user2.globalRole,
      user2.organizationId,
      user2.organizationRole
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
      user2.id,
      ProjectRole.USER,
      organization.id
    );

    await createProjectMember(
      prismaTest,
      project.id,
      user3.id,
      ProjectRole.VIEWER,
      organization.id
    );

    attachment1 = await createTestAttachment(
      prismaTest,
      testDescription,
      ticket.id,
      AttachmentEntityType.TICKET,
      user2.id,
      'txt',
      organization.id
    );

    attachment2 = await createTestAttachment(
      prismaTest,
      testDescription,
      comment.id,
      AttachmentEntityType.COMMENT,
      user2.id,
      'jpg',
      organization.id
    );
  });

  it('should return all attachments for a Global Admin', async () => {
    const res = await request(app)
      .get(`/api/attachments`)
      .set('Authorization', `Bearer ${tokenUser1}`);
    console.log('test1', res.status);
    console.log('test1', res.body);
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(2);
    expect(res.body[0].fileType).toBe('txt');
    expect(res.body[1].fileType).toBe('jpg');
  });

  it('should return attachment1 for a Project Viewer', async () => {
    const res = await request(app)
      .get(`/api/attachments/${AttachmentEntityType.TICKET}/${ticket!.id}`)
      .set('Authorization', `Bearer ${tokenUser3}`);
    console.log('test2', res.status);
    console.log('test2', res.body);
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
    expect(res.body[0].entityType).toBe('TICKET');
    expect(res.body[0].fileType).toBe('txt');
  });

  afterAll(async () => {
    await prismaTest.$disconnect();

    if (attachment1.filePath) {
      await unlink(attachment1.filePath);
    }
    if (attachment2.filePath) {
      await unlink(attachment2.filePath);
    }
  });
});
