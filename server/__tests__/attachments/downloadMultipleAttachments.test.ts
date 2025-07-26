import { describe, expect, afterAll, beforeAll, it } from '@jest/globals';
// import fs from 'fs/promises';
import request from 'supertest';
import dotenv from 'dotenv';

import {
  Organization,
  User,
  ProjectRole,
  Ticket,
  Attachment,
  OrganizationRole,
} from '@prisma/client';
import { app } from '../../src/app';
import { prismaTest } from '../../src/lib/prismaTestClient';
import { unlink } from 'fs/promises';

import { resetTestDatabase } from '../../src/utilities/testUtilities/resetTestDatabase';
import { createUserProfile } from '../../src/utilities/testUtilities/createUserProfile';
import { createOrganization } from '../../src/utilities/testUtilities/createOrganization';
import { createProject } from '../../src/utilities/testUtilities/createProject';
import { createBoard } from '../../src/utilities/testUtilities/createBoard';
import { createTicket } from '../../src/utilities/testUtilities/createTicket';
import { createProjectMember } from '../../src/utilities/testUtilities/createProjectMember';
import { createTestAttachments } from '../../src/utilities/testUtilities/createAttachments';
import { generateJwtToken } from '../../src/utilities/testUtilities/generateJwtToken';

dotenv.config();

describe('downloadMultipleAttachments', () => {
  const testDescription = 'downloadMultipleAttachments';
  let attachments: Attachment[];
  let attachmentIds: number[];
  let user1: User;
  let token: string;
  let ticket: Ticket | undefined;
  let organization: Organization;
  // let filePath: string;

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
      ticket.id,
      'TICKET',
      user1.id,
      'pdf',
      organization.id
    );

    attachmentIds = attachments.map((attachment) => {
      return attachment.id;
    });
  });

  it('should download multiple attachments', async () => {
    const req = request(app)
      .post(`/api/attachments/download`)
      .send({
        attachmentIds: attachmentIds,
        entityId: ticket!.id,
        entityType: 'TICKET',
      })
      .set('Authorization', `Bearer ${token}`)
      .buffer()
      .parse((res, cb) => {
        const chunks: Uint8Array[] = [];
        res.on('data', (chunk) => chunks.push(chunk));
        res.on('end', () => cb(null, Buffer.concat(chunks)));
      });

    const res = await req;

    expect(res.status).toBe(200);
    expect(res.header['content-type']).toBe('application/zip');
    expect(res.header['content-disposition']).toMatch(/attachment/);
    expect(res.body).toBeInstanceOf(Buffer);
    expect(res.body.length).toBeGreaterThan(0);
  });
  afterAll(async () => {
    for (const attachment of attachments) {
      if (attachment.filePath) {
        await unlink(attachment.filePath);
      }
    }
    await prismaTest.$disconnect();
  });
});
