import { describe, expect, afterAll, beforeAll, it } from '@jest/globals';
import request from 'supertest';
import bcrypt from 'bcrypt';

import { OrganizationRole, Organization, User } from '@prisma/client';
import { app } from '../../src/app';
import { prismaTest } from '../../src/lib/prismaTestClient';
import { createOrganization } from '../../src/utilities/testUtilities/createOrganization';
import { createUserProfile } from '../../src/utilities/testUtilities/createUserProfile';
import { hashPassword } from '../../src/utilities/password';
import { resetTestDatabase } from '../../src/utilities/testUtilities/resetTestDatabase';
import { generateJwtToken } from '../../src/utilities/testUtilities/generateJwtToken';
import { createOrgCountRecords } from '../../src/utilities/testUtilities/createOrgCountRecords';
import { redisClient } from '../../src/lib/connectRedis';

describe('Self-update user password', () => {
  let token: string;
  let user: User;
  let organization: Organization;
  let originalHashedPassword: string;

  const testDescription = 'SelfUpdateUserPassword';
  beforeAll(async () => {
    await prismaTest.$connect();
    await resetTestDatabase();
    organization = await createOrganization(prismaTest, testDescription);
    await createOrgCountRecords(prismaTest, organization.id);
    user = await createUserProfile(
      prismaTest,
      testDescription,
      OrganizationRole.USER,
      organization.id,
    );
    originalHashedPassword = user.passwordHash;
    token = generateJwtToken(
      user.id,
      user.globalRole,
      user.organizationId,
      user.organizationRole,
    );
  });
  afterAll(async () => {
    await redisClient.quit();
    await prismaTest.$disconnect();
  });

  it('changes user password', async () => {
    const res = await request(app)
      .patch(`/api/users/updatePasswordSelf`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        newPassword: 'NewPassWord2!',
        confirmPassword: 'NewPassWord2!',
      });
    expect(res.status).toBe(200);
    expect(res.body.message).toBe('User password updated successfully');

    const updatedUser = await prismaTest.user.findUnique({
      where: { id: user.id },
    });

    const matchesNewPassword = await bcrypt.compare(
      'NewPassWord2!',
      updatedUser!.passwordHash,
    );

    expect(matchesNewPassword).toBe(true);

    const matchesOldPassword = await bcrypt.compare(
      'seedPassword123', // whatever your seed used
      updatedUser!.passwordHash,
    );

    expect(matchesOldPassword).toBe(false);
  });
});
