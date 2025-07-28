import { describe, expect, afterAll, beforeAll, it } from '@jest/globals';
import request from 'supertest';

import { User } from '@prisma/client';
import { app } from '../../src/app';
import { prismaTest } from '../../src/lib/prismaTestClient';
import { createSuperUser } from '../../src/utilities/testUtilities/createSuperUser';
import { resetTestDatabase } from '../../src/utilities/testUtilities/resetTestDatabase';
import { generateJwtToken } from '../../src/utilities/testUtilities/generateJwtToken';

describe('Update SuperUser', () => {
  let token1: string;
  let superUser1: User;
  let superUser2: User;
  const testDescription = 'updateSuperUser';

  beforeAll(async () => {
    await prismaTest.$connect();
    await resetTestDatabase();
    superUser1 = await createSuperUser(prismaTest, `${testDescription}_1`);
    superUser2 = await createSuperUser(prismaTest, `${testDescription}_2`);
    token1 = generateJwtToken(superUser1.id, superUser1.globalRole, null, null);
    generateJwtToken(superUser2.id, superUser2.globalRole, null, null);
  });
  afterAll(async () => {
    await prismaTest.$disconnect();
  });

  it("updates the user's information", async () => {
    const res = await request(app)
      .patch(`/api/superuser/profiles/${superUser1.id}`)
      .set('Authorization', `Bearer ${token1}`)
      .send({
        firstName: 'James',
        lastName: 'Brown',
      });
    expect(res.status).toBe(200);
    expect(res.body.message).toBe('User updated successfully');
    expect(res.body.data).toEqual({
      id: expect.any(Number),
      firstName: 'James',
      lastName: 'Brown',
      email: expect.any(String),
      passwordHash: expect.any(String),
      globalRole: expect.any(String),
      avatarSource: expect.any(String),
      isBanned: expect.any(Boolean),
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
      deletedAt: null,
      isDeleted: expect.any(Boolean),
      organizationId: null,
      organizationRole: null,
    });
  });
  it('should reject non-self change', async () => {
    const res = await request(app)
      .patch(`/api/superuser/profiles/${superUser2.id}`)
      .set('Authorization', `Bearer ${token1}`)
      .send({
        firstName: 'James',
        lastName: 'Brown',
      });
    expect(res.status).toBe(403);
    expect(res.body.message).toEqual(
      "Unauthorized. Cannot change another SuperUser's information"
    );
  });
});
