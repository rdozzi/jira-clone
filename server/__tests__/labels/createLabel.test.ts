import { describe, expect, afterAll, beforeAll, it } from '@jest/globals';
import request from 'supertest';

import { GlobalRole, User } from '@prisma/client';
import { app } from '../../src/app';
import { prismaTest } from '../../src/lib/prismaTestClient';
import { createUserProfile } from '../../src/utilities/testUtilities/createUserProfile';
import { resetTestDatabase } from '../../src/utilities/testUtilities/resetTestDatabase';
import { generateJwtToken } from '../../src/utilities/testUtilities/generateJwtToken';

describe('createLabel', () => {
  let token: string;
  let user: User;
  const testDescription = 'createLabel';
  beforeAll(async () => {
    await prismaTest.$connect();
    await resetTestDatabase();
    user = await createUserProfile(
      prismaTest,
      testDescription,
      GlobalRole.ADMIN
    );
    token = generateJwtToken(user.id, user.globalRole);
  });
  afterAll(async () => {
    await prismaTest.$disconnect();
  });

  it('should create a label', async () => {
    const res = await request(app)
      .post('/api/labels')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: `${testDescription}_label`, color: '#FF0000' });
    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      message: 'Label successfully created',
      label: {
        id: expect.any(Number),
        name: `Createlabel_label`, // Hard-coded to satisfy test purposes
        color: '#FF0000',
        createdAt: expect.any(String),
      },
    });
  });
  it('should give a 400 error message: string length', async () => {
    const res = await request(app)
      .post('/api/labels')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: `4lxh8GJoElTXMposwhki7t7m9s`, color: '#FF0000' });
    //random.org: Length is 26 chars long.
    expect(res.status).toBe(400);
    expect(res.body.error).toEqual(
      'Label name is required and must be 25 characters or fewer.'
    );
  });
  it('should give a 400 error message: invalid color format', async () => {
    const res = await request(app)
      .post('/api/labels')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: `${testDescription}_label`, color: '#1234567' });
    //random.org: Length is 26 chars long.
    expect(res.status).toBe(400);
    expect(res.body.error).toEqual(
      'Color must be a valid 6-digit hex code (e.g., #AABBCC).'
    );
  });
});
