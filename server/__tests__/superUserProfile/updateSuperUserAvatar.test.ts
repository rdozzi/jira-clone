import { describe, expect, afterAll, beforeAll, it } from '@jest/globals';
import request from 'supertest';
import dotenv from 'dotenv';

import { app } from '../../src/app';
import path from 'path';
import fs from 'fs/promises';
import { prismaTest } from '../../src/lib/prismaTestClient';
import { createSuperUser } from '../../src/utilities/testUtilities/createSuperUser';
import { generateJwtToken } from '../../src/utilities/testUtilities/generateJwtToken';
import { resetTestDatabase } from '../../src/utilities/testUtilities/resetTestDatabase';
import { User } from '@prisma/client';

dotenv.config();

describe.skip('Update User Avatar', () => {
  const testDescription = 'updateUserAvatar';
  let token1: string;
  let superUser1: User;
  let superUser2: User;
  let avatarSource1: string;

  beforeAll(async () => {
    await prismaTest.$connect();
    await resetTestDatabase();
    superUser1 = await createSuperUser(prismaTest, `${testDescription}_1`);
    superUser2 = await createSuperUser(prismaTest, `${testDescription}_2`);
    token1 = generateJwtToken(superUser1.id, superUser1.globalRole, null, null);
  });

  it("should upload a single attachment for a user's avatar", async () => {
    const filePathUpload = path.join(
      __dirname,
      '../../src/utilities/testUtilities/__fixtures__/image1.jpg'
    );
    const res = await request(app)
      .patch(`/api/superuser/profiles/${superUser1.id}/avatar`)
      .set('Authorization', `Bearer ${token1}`)
      .attach('file', filePathUpload);
    expect(res.status).toBe(200);
    expect(res.body.message).toEqual('User avatar updated successfully');
    expect(res.body.data.avatarSource).toEqual(expect.any(String));
    avatarSource1 = res.body.data.avatarSource;
  });

  it('should not allow non-self to upload avatar', async () => {
    const filePathUpload = path.join(
      __dirname,
      '../../src/utilities/testUtilities/__fixtures__/image1.jpg'
    );
    const res = await request(app)
      .patch(`/api/superuser/profiles/${superUser2.id}/avatar`)
      .set('Authorization', `Bearer ${token1}`)
      .attach('file', filePathUpload);
    expect(res.status).toBe(403);
    expect(res.body.message).toEqual(
      "Unauthorized. Cannot change another SuperUser's information"
    );
  });
  afterAll(async () => {
    if (avatarSource1) {
      await fs.rm(avatarSource1, { force: true });
    }
    await prismaTest.$disconnect();
  });
});
