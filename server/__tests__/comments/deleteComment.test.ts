import { describe, expect, afterAll, beforeAll, it } from '@jest/globals';
import request from 'supertest';
import waitForExpect from 'wait-for-expect';
// import fs from 'fs/promises';

import {
  Board,
  OrganizationRole,
  Organization,
  Project,
  Ticket,
  User,
  Comment,
  Attachment,
  ProjectRole,
} from '@prisma/client';
import { app } from '../../src/app';
import { prismaTest } from '../../src/lib/prismaTestClient';
import { createOrganization } from '../../src/utilities/testUtilities/createOrganization';
import { createUserProfile } from '../../src/utilities/testUtilities/createUserProfile';
import { createProject } from '../../src/utilities/testUtilities/createProject';
import { createBoard } from '../../src/utilities/testUtilities/createBoard';
import { createTicket } from '../../src/utilities/testUtilities/createTicket';
import { createComment } from '../../src/utilities/testUtilities/createComment';
import { createTestAttachment } from '../../src/utilities/testUtilities/createAttachments';
import { createProjectMember } from '../../src/utilities/testUtilities/createProjectMember';
import { resetTestDatabase } from '../../src/utilities/testUtilities/resetTestDatabase';
import { generateJwtToken } from '../../src/utilities/testUtilities/generateJwtToken';

describe('Delete a comment', () => {
  let token: string;
  let user: User;
  let project: Project;
  let board: Board;
  let ticket: Ticket;
  let comment: Comment;
  let attachment: Attachment;
  let organization: Organization;

  const testDescription = 'deleteAComment';
  beforeAll(async () => {
    await prismaTest.$connect();
    await resetTestDatabase();
    organization = await createOrganization(prismaTest, testDescription);
    user = await createUserProfile(
      prismaTest,
      testDescription,
      OrganizationRole.ADMIN,
      organization.id
    );
    token = generateJwtToken(
      user.id,
      user.globalRole,
      user.organizationId,
      user.organizationRole
    );
    project = await createProject(
      prismaTest,
      testDescription,
      user.id,
      organization.id
    );
    project = { ...project, ownerId: user.id };
    board = await createBoard(
      prismaTest,
      testDescription,
      project.id,
      organization.id
    );
    ticket = await createTicket(
      prismaTest,
      testDescription,
      board.id,
      user.id,
      organization.id
    );
    comment = await createComment(
      prismaTest,
      testDescription,
      ticket.id,
      user.id,
      organization.id
    );
    attachment = await createTestAttachment(
      prismaTest,
      testDescription,
      comment.id,
      'COMMENT',
      user.id,
      'jpg',
      organization.id
    );
    await createProjectMember(
      prismaTest,
      project.id,
      user.id,
      ProjectRole.USER,
      organization.id
    );
  });

  it('should delete a comment', async () => {
    const res = await request(app)
      .delete(`/api/comments/${comment.id}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      data: {
        id: expect.any(Number),
        ticketId: expect.any(Number),
        authorId: expect.any(Number),
        content: expect.any(String),
      },
      message: 'Comment deleted successfully',
    });
    await waitForExpect(async () => {
      //attachment
      const attachmentAfterDelete = await prismaTest.attachment.findUnique({
        where: { id: attachment.id },
      });

      expect(attachmentAfterDelete).toBeNull();
    });
  });
  afterAll(async () => {
    await prismaTest.$disconnect();
  });
});
