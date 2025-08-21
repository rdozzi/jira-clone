import { describe, expect, afterAll, beforeAll, it } from '@jest/globals';
import request from 'supertest';
import waitForExpect from 'wait-for-expect';

import {
  Board,
  OrganizationRole,
  Organization,
  Project,
  Ticket,
  User,
  Comment,
  Attachment,
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
import { resetTestDatabase } from '../../src/utilities/testUtilities/resetTestDatabase';
import { generateJwtToken } from '../../src/utilities/testUtilities/generateJwtToken';
import { createOrgCountRecords } from '../../src/utilities/testUtilities/createOrgCountRecords';

describe('Delete a user', () => {
  let token: string;
  let user1: User;
  let user2: User;
  let project: Project;
  let board: Board;
  let ticket: Ticket;
  let comment: Comment;
  let attachment: Attachment;
  let organization: Organization;

  const testDescription = 'deleteAUser';
  beforeAll(async () => {
    await prismaTest.$connect();
    await resetTestDatabase();
    organization = await createOrganization(prismaTest, testDescription);
    await createOrgCountRecords(prismaTest, organization.id);
    user1 = await createUserProfile(
      prismaTest,
      testDescription,
      OrganizationRole.ADMIN,
      organization.id
    );
    user2 = await createUserProfile(
      prismaTest,
      testDescription,
      OrganizationRole.USER,
      organization.id
    );
    token = generateJwtToken(
      user1.id,
      user1.globalRole,
      user1!.organizationId,
      user1!.organizationRole
    );
    project = await createProject(
      prismaTest,
      testDescription,
      user2.id,
      organization.id
    );
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
      user2.id,
      organization.id
    );
    comment = await createComment(
      prismaTest,
      testDescription,
      ticket.id,
      user2.id,
      organization.id
    );
    attachment = await createTestAttachment(
      prismaTest,
      testDescription,
      comment.id,
      'COMMENT',
      user2.id,
      'jpg',
      organization.id
    );
  });
  afterAll(async () => {
    await prismaTest.$disconnect();
  });

  it('should soft-delete a user', async () => {
    const res = await request(app)
      .patch(`/api/users/${user2.id}/soft-delete`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.message).toContain('User deleted successfully');
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
