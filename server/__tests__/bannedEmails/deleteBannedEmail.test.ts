import { describe, expect, afterAll, beforeAll, it } from '@jest/globals';
import request from 'supertest';

import {
  OrganizationRole,
  Organization,
  User,
  BannedEmail,
} from '@prisma/client';
import { app } from '../../src/app';
import { prismaTest } from '../../src/lib/prismaTestClient';
import { createOrganization } from '../../src/utilities/testUtilities/createOrganization';
import { createUserProfile } from '../../src/utilities/testUtilities/createUserProfile';
import { resetTestDatabase } from '../../src/utilities/testUtilities/resetTestDatabase';
import { generateJwtToken } from '../../src/utilities/testUtilities/generateJwtToken';
import { createOrgCountRecords } from '../../src/utilities/testUtilities/createOrgCountRecords';
import { createBannedEmail } from '../../src/utilities/testUtilities/createBannedEmail';
describe('Delete banned email', () => {
  let token: string;
  let user: User;
  let organization: Organization;
  let bannedEmail: BannedEmail;
  const testDescription = 'DeleteBannedEmail';
  beforeAll(async () => {
    await prismaTest.$connect();
    await resetTestDatabase();
    organization = await createOrganization(prismaTest, testDescription);
    await createOrgCountRecords(prismaTest, organization.id);
    user = await createUserProfile(
      prismaTest,
      testDescription,
      OrganizationRole.ADMIN,
      organization.id
    );
    bannedEmail = await createBannedEmail(
      prismaTest,
      testDescription,
      1,
      'For testing',
      organization.id
    );
    token = generateJwtToken(
      user.id,
      user.globalRole,
      user.organizationId,
      user.organizationRole
    );
  });
  afterAll(async () => {
    await prismaTest.$disconnect();
  });

  it('should delete a label', async () => {
    const res = await request(app)
      .delete(`/api/bannedEmails/${bannedEmail.id}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Banned email deleted successfully');
    expect(res.body.data).toEqual({
      email: expect.any(String),
      reason: expect.any(String),
      id: expect.any(Number),
      organizationId: expect.any(Number),
      createdAt: expect.any(String),
    });

    const deletedCannedEmail = await prismaTest.bannedEmail.findUnique({
      where: { id: bannedEmail.id },
    });

    expect(deletedCannedEmail).toBeNull();
  });
});
