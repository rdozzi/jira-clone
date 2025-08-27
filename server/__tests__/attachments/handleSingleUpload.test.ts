import { describe, expect, afterAll, beforeAll, it } from '@jest/globals';
import request from 'supertest';
import dotenv from 'dotenv';

import {
  User,
  ProjectRole,
  Ticket,
  Comment,
  OrganizationRole,
  Organization,
} from '@prisma/client';
import { app } from '../../src/app';
import path from 'path';
import { prismaTest } from '../../src/lib/prismaTestClient';
import { createOrganization } from '../../src/utilities/testUtilities/createOrganization';
import { resetTestDatabase } from '../../src/utilities/testUtilities/resetTestDatabase';
import { createUserProfile } from '../../src/utilities/testUtilities/createUserProfile';
import { createProject } from '../../src/utilities/testUtilities/createProject';
import { createBoard } from '../../src/utilities/testUtilities/createBoard';
import { createTicket } from '../../src/utilities/testUtilities/createTicket';
import { createComment } from '../../src/utilities/testUtilities/createComment';
import { createProjectMember } from '../../src/utilities/testUtilities/createProjectMember';
import { generateJwtToken } from '../../src/utilities/testUtilities/generateJwtToken';
import { createOrgCountRecords } from '../../src/utilities/testUtilities/createOrgCountRecords';
import { deleteRedisKey } from '../../src/utilities/testUtilities/deleteRedisKey';
import { deleteUploads } from '../../src/utilities/testUtilities/deleteUploads';
import { ResourceType } from '../../src/types/ResourceAndColumnTypes';
import waitForExpect from 'wait-for-expect';

dotenv.config();

describe('handleSingleUpload', () => {
  const testDescription = 'handleSingleUpload';
  let user1: User;
  let user2: User;
  let token: string;
  let ticket: Ticket | undefined;
  let comment: Comment;
  let comment2: Comment;
  let organization: Organization;
  const resourceType: ResourceType = 'FileStorage';

  beforeAll(async () => {
    await prismaTest.$connect();
    await resetTestDatabase();
    organization = await createOrganization(prismaTest, testDescription);
    await createOrgCountRecords(prismaTest, organization.id);
    user1 = await createUserProfile(
      prismaTest,
      `${testDescription}_user1`,
      OrganizationRole.USER,
      organization.id
    );
    user2 = await createUserProfile(
      prismaTest,
      `${testDescription}_user2`,
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
    comment2 = await createComment(
      prismaTest,
      `${testDescription}_2`,
      ticket.id,
      user2.id,
      organization.id
    );
    await createProjectMember(
      prismaTest,
      project.id,
      user1.id,
      ProjectRole.USER,
      organization.id
    );
  });
  afterAll(async () => {
    await deleteRedisKey(organization.id, resourceType);
    await deleteUploads();
    await prismaTest.$disconnect();
  });

  it('should upload a single attachment', async () => {
    const filePathUpload = path.join(
      __dirname,
      '../../src/utilities/testUtilities/__fixtures__/image1.jpg'
    );
    const res = await request(app)
      .post(`/api/attachments/single`)
      .set('Authorization', `Bearer ${token}`)
      .field('entityType', 'COMMENT')
      .field('entityId', comment.id)
      .attach('file', filePathUpload);
    expect(res.status).toBe(201);
    expect(res.body.message).toEqual('File uploaded successfully');
    expect(res.body.attachment).toMatchObject({
      entityType: expect.any(String),
      entityId: expect.any(Number),
      uploadedBy: expect.any(Number),
      fileName: expect.any(String),
      fileType: expect.any(String),
      fileSize: expect.any(Number),
      storageType: expect.any(String),
    });
    expect(
      res.body.attachment.filePath === null ||
        typeof res.body.attachment.filePath === 'string'
    ).toBe(true);
    expect(
      res.body.attachment.fileUrl === null ||
        typeof res.body.attachment.fileUrl === 'string'
    ).toBe(true);

    // Attachment ActivityLog
    await waitForExpect(async () => {
      const activityLog = await prismaTest.activityLog.findMany({
        where: { organizationId: organization.id },
      });
      expect(activityLog.length).toBe(1);
      expect(activityLog[0]).toEqual({
        id: expect.any(Number),
        userId: expect.any(Number),
        actorType: expect.any(String),
        action: expect.any(String),
        targetId: expect.any(Number),
        targetType: expect.any(String),
        metadata: expect.objectContaining({
          commentId: expect.any(Number),
          filename: expect.any(String),
          mimetype: expect.any(String),
          savedPath: expect.any(String),
          size: expect.any(Number),
          storageType: expect.any(String),
        }),
        createdAt: expect.any(Date),
        organizationId: expect.any(Number),
      });
    });
  });
  // Given the current architecture of the attachment routes. Post-MVP, the routes will be retooled to prevent the creation of attachments before authorization.
  it('should not allow the attachment to be attached', async () => {
    const filePathUpload = path.join(
      __dirname,
      '../../src/utilities/testUtilities/__fixtures__/image2.png'
    );
    const req = request(app)
      .post(`/api/attachments/single`)
      .set('Authorization', `Bearer ${token}`)
      .field('entityType', 'COMMENT')
      .field('entityId', comment2.id)
      .attach('file', filePathUpload);

    const res = await req;
    expect(res.status).toBe(401);
    expect(res.body.message).toBe('You do not own this comment');
  });
});
