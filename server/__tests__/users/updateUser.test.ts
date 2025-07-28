import { describe, expect, afterAll, beforeAll, it } from '@jest/globals';
import request from 'supertest';

import { OrganizationRole, Organization, User } from '@prisma/client';
import { app } from '../../src/app';
import { prismaTest } from '../../src/lib/prismaTestClient';
import { createOrganization } from '../../src/utilities/testUtilities/createOrganization';
import { createUserProfile } from '../../src/utilities/testUtilities/createUserProfile';
import { resetTestDatabase } from '../../src/utilities/testUtilities/resetTestDatabase';
import { generateJwtToken } from '../../src/utilities/testUtilities/generateJwtToken';

describe('Update user', () => {
  let token: string;
  let user: User;
  let organization: Organization;

  const testDescription = 'updateUser';
  beforeAll(async () => {
    await prismaTest.$connect();
    await resetTestDatabase();
    organization = await createOrganization(prismaTest, testDescription);
    user = await createUserProfile(
      prismaTest,
      testDescription,
      OrganizationRole.USER,
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

  it("updates the user's information", async () => {
    const res = await request(app)
      .patch(`/api/users/${user.id}/update`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        firstName: 'James',
        lastName: 'Brown',
      });
    expect(res.status).toBe(200);
    expect(res.body).toEqual(
      expect.objectContaining({
        data: {
          id: expect.any(Number),
          firstName: 'James',
          lastName: 'Brown',
          email: expect.any(String),
          passwordHash: expect.any(String),
          globalRole: 'USER',
          avatarSource: 'NA',
          isBanned: false,
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
          deletedAt: null,
          isDeleted: false,
          organizationId: expect.any(Number),
          organizationRole: expect.any(String),
        },
        message: expect.any(String),
      })
    );
  });
  it('update to reject self-role promotion request', async () => {
    const res = await request(app)
      .patch(`/api/users/${user.id}/update`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        globalRole: 'ADMIN',
      });
    expect(res.status).toBe(403);
    expect(res.body.error).toEqual(
      'Unauthorized to change your own global role.'
    );
  });
});
