import { describe, expect, afterAll, beforeAll, it } from '@jest/globals';
import request from 'supertest';

import { User, Organization, OrganizationRole } from '@prisma/client';
import { app } from '../../src/app';
import { prismaTest } from '../../src/lib/prismaTestClient';
import { createOrganization } from '../../src/utilities/testUtilities/createOrganization';
import { createUserProfile } from '../../src/utilities/testUtilities/createUserProfile';
import { resetTestDatabase } from '../../src/utilities/testUtilities/resetTestDatabase';
import { generateJwtToken } from '../../src/utilities/testUtilities/generateJwtToken';

describe('Get all users', () => {
  let token: string;
  let user1: User;
  const testDescription = 'getAllUsers';
  let organization: Organization;

  beforeAll(async () => {
    await prismaTest.$connect();
    await resetTestDatabase();
    organization = await createOrganization(prismaTest, testDescription);
    user1 = await createUserProfile(
      prismaTest,
      `${testDescription}_1`,
      OrganizationRole.ADMIN,
      organization.id
    );
    //user 2
    await createUserProfile(
      prismaTest,
      `${testDescription}_2`,
      OrganizationRole.USER,
      organization.id
    );
    //user 3
    await createUserProfile(
      prismaTest,
      `${testDescription}_3`,
      OrganizationRole.GUEST,
      organization.id
    );
    //user 4
    await createUserProfile(
      prismaTest,
      `${testDescription}_4`,
      OrganizationRole.GUEST,
      organization.id
    );

    token = generateJwtToken(
      user1.id,
      user1.globalRole,
      user1.organizationId,
      user1.organizationRole
    );
  });
  afterAll(async () => {
    await prismaTest.$disconnect();
  });

  it('should get all users', async () => {
    const res = await request(app)
      .get(`/api/users/all`)
      .set('Authorization', `Bearer ${token}`);
    console.log(res.body);
    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Users fetched successfully');
    expect(res.body.data).toHaveLength(4);
  });
});
