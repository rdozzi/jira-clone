import { describe, expect, afterAll, beforeAll, it } from '@jest/globals';
import request from 'supertest';

import { OrganizationRole, Organization, User, Label } from '@prisma/client';
import { app } from '../../src/app';
import { prismaTest } from '../../src/lib/prismaTestClient';
import { createOrganization } from '../../src/utilities/testUtilities/createOrganization';
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
      'label_2',
      '#FF0000',
      organization.id
    );
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
    expect(res.body.message).toBe('Label updated successfully');
    expect(res.body.data).toEqual({
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
    expect(res.body.message).toBe('Label updated successfully');
    expect(res.body.data).toEqual({
      ...normalizeEntity(label_2),
      color: '#0000FF',
    });
  });
});
