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
import { createSuperUser } from '../../src/utilities/testUtilities/createSuperUser';
import { createUserProfile } from '../../src/utilities/testUtilities/createUserProfile';
import { createProject } from '../../src/utilities/testUtilities/createProject';
import { createBoard } from '../../src/utilities/testUtilities/createBoard';
import { createTicket } from '../../src/utilities/testUtilities/createTicket';
import { createComment } from '../../src/utilities/testUtilities/createComment';
import { createTestAttachment } from '../../src/utilities/testUtilities/createAttachments';
import { createProjectMember } from '../../src/utilities/testUtilities/createProjectMember';
import { resetTestDatabase } from '../../src/utilities/testUtilities/resetTestDatabase';
import { generateJwtToken } from '../../src/utilities/testUtilities/generateJwtToken';
import { createOrgCountRecords } from '../../src/utilities/testUtilities/createOrgCountRecords';

describe.skip('Delete Record', () => {
  let token: string;
  let superUser: User;
  let user: User;
  let project: Project;
  let board: Board;
  let ticket: Ticket;
  let comment: Comment;
  let attachment: Attachment;
  let organization: Organization;

  const testDescription = 'deleteRecord';
  beforeAll(async () => {
    await prismaTest.$connect();
    await resetTestDatabase();
    organization = await createOrganization(prismaTest, testDescription);
    await createOrgCountRecords(prismaTest, organization.id);
    user = await createUserProfile(
      prismaTest,
      testDescription,
      OrganizationRole.ADMIN,
      organization.id
    );
    superUser = await createSuperUser(prismaTest, testDescription);
    token = generateJwtToken(superUser.id, superUser.globalRole, null, null);
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
      .delete(
        `/api/superuser/function/COMMENT/${organization.id}/${comment.id}`
      )
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.message).toBe(`Record deleted successfully`);
    expect(res.body.data).toEqual({
      id: expect.any(Number),
      ticketId: expect.any(Number),
      authorId: expect.any(Number),
      content: expect.any(String),
      createdAt: expect.any(String),
      organizationId: expect.any(Number),
      updatedAt: expect.any(String),
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
