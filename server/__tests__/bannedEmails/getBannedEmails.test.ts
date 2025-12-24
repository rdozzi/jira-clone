import { describe, expect, afterAll, beforeAll, it } from '@jest/globals';
import request from 'supertest';

import {
  User,
  BannedEmail,
  Organization,
  OrganizationRole,
} from '@prisma/client';
import { app } from '../../src/app';
import { prismaTest } from '../../src/lib/prismaTestClient';
import { createOrganization } from '../../src/utilities/testUtilities/createOrganization';
import { resetTestDatabase } from '../../src/utilities/testUtilities/resetTestDatabase';
import { createUserProfile } from '../../src/utilities/testUtilities/createUserProfile';
import { createBannedEmail } from '../../src/utilities/testUtilities/createBannedEmail';
import { normalizeEntity } from '../../src/utilities/testUtilities/normalizeEntity';
import { generateJwtToken } from '../../src/utilities/testUtilities/generateJwtToken';

describe.skip('getBannedEmailRecords', () => {
  const testDescription = 'getBannedEmailRecords';
  let user: User;
  let token: string;
  let bannedEmail_1: BannedEmail;
  let bannedEmail_2: BannedEmail;
  let organization: Organization;

  beforeAll(async () => {
    await prismaTest.$connect();
    await resetTestDatabase();
    organization = await createOrganization(prismaTest, testDescription);
    user = await createUserProfile(
      prismaTest,
      testDescription,
      OrganizationRole.ADMIN,
      organization.id
    );
    token = generateJwtToken(
      user.id,
      user.globalRole,
      user.organizationId,
      user.organizationRole
    );
    bannedEmail_1 = await createBannedEmail(
      prismaTest,
      testDescription,
      1,
      'Banned Email 1 Test Reason',
      organization.id
    );
    bannedEmail_2 = await createBannedEmail(
      prismaTest,
      testDescription,
      2,
      'Banned Email 2 Test Reason',
      organization.id
    );
  });
  afterAll(async () => {
    await prismaTest.$disconnect();
  });

  it('should return all banned email records', async () => {
    const res = await request(app)
      .get('/api/bannedEmails')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(2);
    expect(res.body).toEqual([
      normalizeEntity(bannedEmail_1),
      normalizeEntity(bannedEmail_2),
    ]);
  });
  it('should return one banned email record', async () => {
    const res = await request(app)
      .get('/api/bannedEmails/1')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body).toBeInstanceOf(Object);
    expect(res.body).toEqual(normalizeEntity(bannedEmail_1));
  });
  it('should return 404 for a non-existent record', async () => {
    const res = await request(app)
      .get('/api/bannedEmails/9999')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(404);
    expect(res.body).toMatchObject({ error: 'Banned email not found' });
  });
});
