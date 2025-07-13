import { describe, expect, afterAll, beforeAll, it } from '@jest/globals';
import request from 'supertest';

import { GlobalRole, User, Label } from '@prisma/client';
import { app } from '../../src/app';
import { prismaTest } from '../../src/lib/prismaTestClient';
import { resetTestDatabase } from '../../src/utilities/testUtilities/resetTestDatabase';
import { createUserProfile } from '../../src/utilities/testUtilities/createUserProfile';
import { createLabel } from '../../src/utilities/testUtilities/createLabel';
import { normalizeEntity } from '../../src/utilities/testUtilities/normalizeEntity';
import { generateJwtToken } from '../../src/utilities/testUtilities/generateJwtToken';

describe('getBannedEmailRecords', () => {
  const testDescription = 'getBannedEmailRecords';
  let user: User;
  let token: string;
  let label_1: Label;
  let label_2: Label;

  beforeAll(async () => {
    await prismaTest.$connect();
    await resetTestDatabase();
    user = await createUserProfile(
      prismaTest,
      testDescription,
      GlobalRole.ADMIN
    );
    token = generateJwtToken(user.id, user.globalRole);
    label_1 = await createLabel(prismaTest, 'label_1', '#FF0000');
    label_2 = await createLabel(prismaTest, 'label_1', '#0000FF');
  });
  afterAll(async () => {
    await prismaTest.$disconnect();
  });

  it('should return all banned email records', async () => {
    const res = await request(app)
      .get('/api/labels')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(2);
    expect(res.body).toEqual([
      normalizeEntity(label_1),
      normalizeEntity(label_2),
    ]);
  });
});
