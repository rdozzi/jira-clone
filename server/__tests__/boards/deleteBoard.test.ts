import { describe, expect, afterAll, beforeAll, it } from '@jest/globals';
import request from 'supertest';
import waitForExpect from 'wait-for-expect';
// import fs from 'fs/promises';

import {
  Board,
  Organization,
  OrganizationRole,
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
import { createOrganization } from '../../src/utilities/testUtilities/createOrganization';
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
  let board: Board;
  let ticket: Ticket;
  let comment1: Comment;
  let attachment1: Attachment;
  let attachment2: Attachment;
  let attachment3: Attachment;
  let label1: Label;
  let label2: Label;
  let organization: Organization;

  const testDescription = 'deleteABoard';
  beforeAll(async () => {
    await prismaTest.$connect();
    await resetTestDatabase();
    organization = await createOrganization(prismaTest, testDescription);
    user = await createUserProfile(
      prismaTest,
      testDescription,
      OrganizationRole.USER,
      organization.id
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
    comment1 = await createComment(
      prismaTest,
      `${testDescription}_1`,
      ticket.id,
      user.id,
      organization.id
    );

    // Comment 2
    await createComment(
      prismaTest,
      `${testDescription}_2`,
      ticket.id,
      user.id,
      organization.id
    );

    attachment1 = await createTestAttachment(
      prismaTest,
      testDescription,
      comment1.id,
      'COMMENT',
      user.id,
      'jpg',
      organization.id
    );

    attachment2 = await createTestAttachment(
      prismaTest,
      testDescription,
      ticket.id,
      'TICKET',
      user.id,
      'pdf',
      organization.id
    );

    attachment3 = await createTestAttachment(
      prismaTest,
      testDescription,
      board.id,
      'BOARD',
      user.id,
      'png',
      organization.id
    );

    await createProjectMember(
      prismaTest,
      project.id,
      user.id,
      ProjectRole.ADMIN,
      organization.id
    );

    label1 = await createLabel(
      prismaTest,
      'test label 1',
      '#AAA123',
      organization.id
    );
    label2 = await createLabel(
      prismaTest,
      'test label 2',
      '#E74C3C',
      organization.id
    );

    await createTicketLabel(prismaTest, ticket.id, label1.id, organization.id);
    await createTicketLabel(prismaTest, ticket.id, label2.id, organization.id);
    token = generateJwtToken(
      user.id,
      user.globalRole,
      user.organizationId,
      user.organizationRole
    );
  });

  it('should delete a board and all of its dependencies', async () => {
    const res = await request(app)
      .delete(`/api/boards/${board.id}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      data: {
        id: expect.any(Number),
        name: expect.any(String),
        projectId: expect.any(Number),
        description: expect.any(String),
      },
      message: 'Board deleted successfully',
    });
    await waitForExpect(async () => {
      //ticket
      const ticketAfterDelete = await prismaTest.ticket.findUnique({
        where: { id: ticket.id },
      });
      expect(ticketAfterDelete).toBeNull();

      //comment
      const commentsAfterDelete = await prismaTest.comment.findMany({
        where: { ticketId: ticket.id },
      });
      expect(commentsAfterDelete).toHaveLength(0);

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
