import { describe, expect, afterAll, beforeAll, it } from '@jest/globals';
import request from 'supertest';

import { OrganizationRole, Organization, User, Label } from '@prisma/client';
import { app } from '../../src/app';
import { prismaTest } from '../../src/lib/prismaTestClient';
import { createOrganization } from '../../src/utilities/testUtilities/createOrganization';
import { resetTestDatabase } from '../../src/utilities/testUtilities/resetTestDatabase';
import { createUserProfile } from '../../src/utilities/testUtilities/createUserProfile';
import { createLabel } from '../../src/utilities/testUtilities/createLabel';
import { normalizeEntity } from '../../src/utilities/testUtilities/normalizeEntity';
import { generateJwtToken } from '../../src/utilities/testUtilities/generateJwtToken';

describe.skip('getBannedEmailRecords', () => {
  const testDescription = 'getBannedEmailRecords';
  let user: User;
  let token: string;
  let label_1: Label;
  let label_2: Label;
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
    label_1 = await createLabel(
      prismaTest,
      'label_1',
      '#FF0000',
      organization.id
    );
    label_2 = await createLabel(
      prismaTest,
      'label_1',
      '#0000FF',
      organization.id
    );
  });
  afterAll(async () => {
    await prismaTest.$disconnect();
  });

  it('should return all banned email records', async () => {
    const res = await request(app)
      .get('/api/labels')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(2);
    expect(res.body.data).toEqual([
      normalizeEntity(label_1),
      normalizeEntity(label_2),
    ]);
  });
});
