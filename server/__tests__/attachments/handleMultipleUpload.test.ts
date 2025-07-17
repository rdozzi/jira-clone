import { describe, expect, afterAll, beforeAll, it } from '@jest/globals';
import request from 'supertest';
import dotenv from 'dotenv';

import {
  GlobalRole,
  User,
  ProjectRole,
  Ticket,
  Comment,
  Attachment,
} from '@prisma/client';
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

describe('handleMultipleUpload', () => {
  const testDescription = 'handleMultipleUpload';
  let uploadedFiles: string[];
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
    const project = await createProject(prismaTest, testDescription, user1.id);
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
  });

  it('should upload a single attachment', async () => {
    const fixtureDir = path.join(
      __dirname,
      '../../src/utilities/testUtilities/__fixtures__'
    );
    const files = await fs.readdir(fixtureDir);

    const req = request(app)
      .post(`/api/attachments/many`)
      .set('Authorization', `Bearer ${token}`)
      .field('entityType', 'COMMENT')
      .field('entityId', comment.id);

    for (const file of files) {
      const fullPath = path.join(fixtureDir, file);
      req.attach('files', fullPath);
    }

    const res = await req;

    expect(res.status).toBe(201);
    expect(res.body.message).toEqual(`${files.length} uploaded successfully`);
    console.log(res.body);
    uploadedFiles = res.body.createdAttachments.map(
      (attachment: Attachment) => {
        return attachment.filePath;
      }
    );
    console.log(uploadedFiles);
  });
  afterAll(async () => {
    if (uploadedFiles) {
      for (const files of uploadedFiles) {
        await fs.rm(files, { force: true });
      }
    }
    await prismaTest.$disconnect();
  });
});
