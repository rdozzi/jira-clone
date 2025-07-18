import { describe, expect, afterAll, beforeAll, it } from '@jest/globals';
import request from 'supertest';

import { User, GlobalRole } from '@prisma/client';
import { app } from '../../src/app';
import { prismaTest } from '../../src/lib/prismaTestClient';
import { createUserProfile } from '../../src/utilities/testUtilities/createUserProfile';
import { createProject } from '../../src/utilities/testUtilities/createProject';
import { resetTestDatabase } from '../../src/utilities/testUtilities/resetTestDatabase';
import { generateJwtToken } from '../../src/utilities/testUtilities/generateJwtToken';

describe('Get Projects', () => {
  let token: string;
  let user: User;
  const testDescription = 'getProjects';
  beforeAll(async () => {
    await prismaTest.$connect();
    await resetTestDatabase();
    user = await createUserProfile(
      prismaTest,
      `${testDescription}_1`,
      GlobalRole.ADMIN
    );
    await createProject(prismaTest, `${testDescription}_1`, user.id);
    await createProject(prismaTest, `${testDescription}_1`, user.id);
    token = generateJwtToken(user.id, user.globalRole);
  });
  afterAll(async () => {
    await prismaTest.$disconnect();
  });

  it('should get all projects', async () => {
    const res = await request(app)
      .get(`/api/projects`)
      .set('Authorization', `Bearer ${token}`);
    console.log(res.body);
    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Projects fetched succesfully');
    expect(res.body.data).toHaveLength(2);
  });
});
