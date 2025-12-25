import { describe, expect, afterAll, beforeAll, it } from '@jest/globals';
import request from 'supertest';

import { User } from '@prisma/client';
import { app } from '../../src/app';
import { prismaTest } from '../../src/lib/prismaTestClient';
import { createSuperUser } from '../../src/utilities/testUtilities/createSuperUser';
import { resetTestDatabase } from '../../src/utilities/testUtilities/resetTestDatabase';
import { generateJwtToken } from '../../src/utilities/testUtilities/generateJwtToken';

describe.skip('Delete a SuperUser', () => {
  let token1: string;
  // let token2: string;
  let superUser1: User;
  let superUser2: User;

  const testDescription = 'deleteASuperUser';
  beforeAll(async () => {
    await prismaTest.$connect();
    await resetTestDatabase();
    superUser1 = await createSuperUser(prismaTest, `${testDescription}_1`);
    superUser2 = await createSuperUser(prismaTest, `${testDescription}_2`);
    token1 = generateJwtToken(superUser1.id, superUser1.globalRole, null, null);
    // token2 = generateJwtToken(superUser2.id, superUser2.globalRole, null, null);
  });
  afterAll(async () => {
    await prismaTest.$disconnect();
  });

  it('should soft-delete a SuperUser', async () => {
    const res = await request(app)
      .patch(`/api/superuser/profiles/${superUser2.id}/soft-delete`)
      .set('Authorization', `Bearer ${token1}`);
    expect(res.status).toBe(200);
    expect(res.body.message).toContain('User deleted successfully');

    const deletedUser = await prismaTest.user.findUnique({
      where: { id: superUser2.id },
    });

    expect(deletedUser!.isDeleted).toBeTruthy();
    expect(deletedUser!.deletedAt).toBeDefined();
  });
  it('should reject an attempt for a SuperUser to delete themself', async () => {
    const res = await request(app)
      .patch(`/api/superuser/profiles/${superUser1.id}/soft-delete`)
      .set('Authorization', `Bearer ${token1}`);
    expect(res.status).toBe(403);
    expect(res.body.error).toBe('SuperUser cannot delete themselves');
  });
});
