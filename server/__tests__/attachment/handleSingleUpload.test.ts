import { describe, expect, afterAll, beforeAll, it } from '@jest/globals';
import request from 'supertest';
import dotenv from 'dotenv';

import { GlobalRole, User, ProjectRole, Ticket, Comment } from '@prisma/client';
import { app } from '../../src/app';
import path from 'path';
import fs from 'fs/promises';
import { prismaTest } from '../../src/lib/prismaTestClient';

import { resetTestDatabase } from '../../src/utilities/testUtilities/resetTestDatabase';
import { createUserProfile } from '../../src/utilities/testUtilities/createUserProfile';
import { createProject } from '../../src/utilities/testUtilities/createProject';
import { createBoard } from '../../src/utilities/testUtilities/createBoard';
import { createTicket } from '../../src/utilities/testUtilities/createTicket';
import { createComment } from '../../src/utilities/testUtilities/createComment';
import { createProjectMember } from '../../src/utilities/testUtilities/createProjectMember';
import { generateJwtToken } from '../../src/utilities/testUtilities/generateJwtToken';

dotenv.config();

describe('handleSingleUpload', () => {
  const testDescription = 'handleSingleUpload';
  let uploadedFileName: string;
  let user: User;
  let token: string;
  let ticket: Ticket | undefined;
  let comment: Comment;

  beforeAll(async () => {
    await prismaTest.$connect();
    await resetTestDatabase();
    user = await createUserProfile(
      prismaTest,
      testDescription,
      GlobalRole.USER
    );
    token = generateJwtToken(user.id, user.globalRole);
    const project = await createProject(prismaTest, testDescription);
    const board = await createBoard(prismaTest, testDescription, project.id);
    ticket = await createTicket(prismaTest, testDescription, board.id, user.id);
    comment = await createComment(
      prismaTest,
      testDescription,
      ticket.id,
      user.id
    );
    await createProjectMember(
      prismaTest,
      project.id,
      user.id,
      ProjectRole.USER
    );
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
    uploadedFileName = res.body.attachment.filePath;
  });
  afterAll(async () => {
    if (uploadedFileName) {
      await fs.rm(uploadedFileName, { force: true });
    }
    await prismaTest.$disconnect();
  });
});
