import { describe, expect, afterAll, beforeAll, it } from '@jest/globals';
// import fs from 'fs/promises';
import request from 'supertest';
import dotenv from 'dotenv';

import {
  GlobalRole,
  User,
  ProjectRole,
  Ticket,
  Attachment,
} from '@prisma/client';
import { app } from '../../src/app';
import { prismaTest } from '../../src/lib/prismaTestClient';

import { resetTestDatabase } from '../../src/utilities/testUtilities/resetTestDatabase';
import { createUserProfile } from '../../src/utilities/testUtilities/createUserProfile';
import { createProject } from '../../src/utilities/testUtilities/createProject';
import { createBoard } from '../../src/utilities/testUtilities/createBoard';
import { createTicket } from '../../src/utilities/testUtilities/createTicket';
import { createProjectMember } from '../../src/utilities/testUtilities/createProjectMember';
import { createTestAttachment } from '../../src/utilities/testUtilities/createAttachments';
import { generateJwtToken } from '../../src/utilities/testUtilities/generateJwtToken';
import path from 'path';
import { unlink } from 'fs/promises';
import { lookup } from 'mime-types';

dotenv.config();

describe('downloadSingleAttachment', () => {
  const testDescription = 'downloadSingleAttachment';
  let attachment: Attachment;
  let user1: User;
  let token: string;
  let ticket: Ticket | undefined;
  // let filePath: string;

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
    await createProjectMember(
      prismaTest,
      project.id,
      user1.id,
      ProjectRole.USER
    );

    attachment = await createTestAttachment(
      prismaTest,
      testDescription,
      ticket.id,
      'TICKET',
      user1.id,
      'pdf'
    );
  });

  it('should download a single attachment', async () => {
    const req = request(app)
      .get(`/api/attachments/${attachment.id}/download`)
      .set('Authorization', `Bearer ${token}`)
      .buffer()
      .parse((res, cb) => {
        const chunks: Uint8Array[] = [];
        res.on('data', (chunk) => chunks.push(chunk));
        res.on('end', () => cb(null, Buffer.concat(chunks)));
      });

    const res = await req;
    console.log('Response Headers', res.header);

    const expectedMime = lookup(path.extname(attachment.fileName));
    const contentType = res.header['content-type'].split(';')[0];

    expect(res.status).toBe(200);
    expect(contentType).toBe(expectedMime);
    expect(res.header['content-disposition']).toMatch(/attachment/);
    expect(res.body instanceof Buffer || res.body instanceof Object).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });
  afterAll(async () => {
    if (attachment.filePath) await unlink(attachment.filePath);
    await prismaTest.$disconnect();
  });
});
