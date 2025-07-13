import { describe, expect, afterAll, beforeAll, it } from '@jest/globals';
import request from 'supertest';

import { GlobalRole, User, Label } from '@prisma/client';
import { app } from '../../src/app';
import { prismaTest } from '../../src/lib/prismaTestClient';
import { resetTestDatabase } from '../../src/utilities/testUtilities/resetTestDatabase';
import { createUserProfile } from '../../src/utilities/testUtilities/createUserProfile';
import { createLabel } from '../../src/utilities/testUtilities/createLabel';
import { generateJwtToken } from '../../src/utilities/testUtilities/generateJwtToken';
import { normalizeEntity } from '../../src/utilities/testUtilities/normalizeEntity';

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
    label_2 = await createLabel(prismaTest, 'label_2', '#FF0000');
  });
  afterAll(async () => {
    await prismaTest.$disconnect();
  });

  it('should return label with updated name', async () => {
    const res = await request(app)
      .patch(`/api/labels/${label_1.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'label_1 update' });
    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Label successfully updated');
    expect(res.body.newLabel).toEqual({
      ...normalizeEntity(label_1),
      name: 'Label_1 Update',
    });
  });

  it('should return label with updated color', async () => {
    const res = await request(app)
      .patch(`/api/labels/${label_2.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ color: '#0000FF' });
    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Label successfully updated');
    expect(res.body.newLabel).toEqual({
      ...normalizeEntity(label_2),
      color: '#0000FF',
    });
  });
});
