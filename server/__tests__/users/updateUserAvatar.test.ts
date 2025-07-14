import { describe, expect, afterAll, beforeAll, it } from '@jest/globals';
import request from 'supertest';
import dotenv from 'dotenv';

import { GlobalRole, User } from '@prisma/client';
import { app } from '../../src/app';
import path from 'path';
import fs from 'fs/promises';
import { prismaTest } from '../../src/lib/prismaTestClient';

// import { createProject } from '../../src/utilities/testUtilities/createProject';
import { createUserProfile } from '../../src/utilities/testUtilities/createUserProfile';
// import { createTestAttachment } from '../../src/utilities/testUtilities/createAttachments';
import { generateJwtToken } from '../../src/utilities/testUtilities/generateJwtToken';
import { resetTestDatabase } from '../../src/utilities/testUtilities/resetTestDatabase';

dotenv.config();

describe('Update User Avatar', () => {
  const testDescription = 'updateUserAvatar';
  let user1: User;
  let user2: User;
  let token1: string;
  let token2: string;
  let avatarSource1: string;
  let avatarSource2: string;

  beforeAll(async () => {
    await prismaTest.$connect();
    await resetTestDatabase();
    // project = await createProject(prismaTest, testDescription);
    user1 = await createUserProfile(
      prismaTest,
      `${testDescription}_user1`,
      GlobalRole.USER
    );
    user2 = await createUserProfile(
      prismaTest,
      `${testDescription}_user2`,
      GlobalRole.ADMIN
    );
    token1 = generateJwtToken(user1.id, user1.globalRole);
    token2 = generateJwtToken(user2.id, user2.globalRole);
  });

  it("should upload a single attachment for a user's avatar", async () => {
    const filePathUpload = path.join(
      __dirname,
      '../../src/utilities/testUtilities/__fixtures__/image1.jpg'
    );
    const res = await request(app)
      .patch(`/api/users/${user1.id}/avatar`)
      .set('Authorization', `Bearer ${token1}`)
      .attach('file', filePathUpload);
    expect(res.status).toBe(200);
    expect(res.body.message).toEqual('User avatar updated successfully');
    expect(res.body.avatarSource).toEqual(expect.any(String));
    avatarSource1 = res.body.avatarSource;
  });
  it("should upload a single attachment for a user's avatar as a non-self admin", async () => {
    const filePathUpload = path.join(
      __dirname,
      '../../src/utilities/testUtilities/__fixtures__/image1.jpg'
    );
    const res = await request(app)
      .patch(`/api/users/${user1.id}/avatar`)
      .set('Authorization', `Bearer ${token2}`)
      .attach('file', filePathUpload);
    expect(res.status).toBe(200);
    expect(res.body.message).toEqual('User avatar updated successfully');
    expect(res.body.avatarSource).toEqual(expect.any(String));
    avatarSource2 = res.body.avatarSource;
  });
  afterAll(async () => {
    if (avatarSource1) {
      await fs.rm(avatarSource1, { force: true });
    }
    if (avatarSource2) {
      await fs.rm(avatarSource2, { force: true });
    }
    await prismaTest.$disconnect();
  });
});
