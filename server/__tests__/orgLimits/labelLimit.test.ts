import { describe, expect, afterAll, beforeAll, it } from '@jest/globals';
import { OrganizationRole, Organization, User, Label } from '@prisma/client';

import { app } from '../../src/app';
import request from 'supertest';
import { prismaTest } from '../../src/lib/prismaTestClient';
import { redisClient } from '../../src/lib/connectRedis';

import { createOrganization } from '../../src/utilities/testUtilities/createOrganization';
import { createLabel } from '../../src/utilities/testUtilities/createLabel';
import { createOrgCountRecords } from '../../src/utilities/testUtilities/createOrgCountRecords';
import { createUserProfile } from '../../src/utilities/testUtilities/createUserProfile';
import generateJwtToken from '../../src/utilities/testUtilities/generateJwtToken';
import { resetTestDatabase } from '../../src/utilities/testUtilities/resetTestDatabase';

describe.skip('Test label counters', () => {
  let token: string;
  let token2: string;
  let token3: string;
  let user: User;
  let user2: User;
  let user3: User;
  let organization: Organization;
  let organization2: Organization;
  let organization3: Organization;
  let label: Label;
  const testDescription = 'TestLabelCounters';
  beforeAll(async () => {
    await prismaTest.$connect();
    await resetTestDatabase();
    organization = await createOrganization(prismaTest, testDescription);
    organization2 = await createOrganization(
      prismaTest,
      `${testDescription}_2`
    );
    organization3 = await createOrganization(
      prismaTest,
      `${testDescription}_3`
    );
    await createOrgCountRecords(prismaTest, organization.id);
    await createOrgCountRecords(prismaTest, organization2.id);
    await createOrgCountRecords(prismaTest, organization3.id);
    user = await createUserProfile(
      prismaTest,
      testDescription,
      OrganizationRole.ADMIN,
      organization.id
    );
    user2 = await createUserProfile(
      prismaTest,
      `${testDescription}_2`,
      OrganizationRole.ADMIN,
      organization2.id
    );
    user3 = await createUserProfile(
      prismaTest,
      `${testDescription}_3`,
      OrganizationRole.ADMIN,
      organization3.id
    );

    token = generateJwtToken(
      user.id,
      user.globalRole,
      user.organizationId,
      user.organizationRole
    );
    token2 = generateJwtToken(
      user2.id,
      user2.globalRole,
      user2.organizationId,
      user2.organizationRole
    );
    token3 = generateJwtToken(
      user3.id,
      user3.globalRole,
      user3.organizationId,
      user3.organizationRole
    );
    label = await createLabel(
      prismaTest,
      `${testDescription}_1`,
      '#0000FF',
      organization.id
    );
  });
  afterAll(async () => {
    await redisClient.quit();
    await prismaTest.$disconnect();
  });

  // Happy Path (Increment + Total)
  it('org-level label should be 1', async () => {
    const res = await request(app)
      .post(`/api/labels`)
      .set('Authorization', `Bearer ${token}`)
      .send({ name: `${testDescription}_label`, color: '#FF0000' });

    expect(res.status).toEqual(201);

    const labelOrgTotal = await prismaTest.organizationLabelUsage.findUnique({
      where: { organizationId: organization.id },
      select: { totalLabels: true },
    });

    const totalCount = labelOrgTotal!.totalLabels;
    expect(totalCount).toEqual(1);

    const labelId = res.body.data.id;

    await prismaTest.label.deleteMany({ where: { id: labelId } });
  });

  // Off-by-one boundary
  it('org-level label should be 100', async () => {
    await prismaTest.organizationLabelUsage.update({
      where: { organizationId: organization.id },
      data: { totalLabels: 99 },
    });

    const res = await request(app)
      .post(`/api/labels`)
      .set('Authorization', `Bearer ${token}`)
      .send({ name: `${testDescription}_label`, color: '#FF0000' });

    expect(res.status).toBe(201);

    const labelOrgTotal = await prismaTest.organizationLabelUsage.findUnique({
      where: { organizationId: organization.id },
      select: { totalLabels: true },
    });

    const totalCount = labelOrgTotal!.totalLabels;
    expect(totalCount).toEqual(100);

    const labelId = res.body.data.id;

    await prismaTest.label.deleteMany({ where: { id: labelId } });
  });

  // Total limit exceded
  it('should reject creation call due to total limit reached', async () => {
    await prismaTest.organizationLabelUsage.update({
      where: { organizationId: organization.id },
      data: { totalLabels: 100 },
    });
    const res = await request(app)
      .post(`/api/labels`)
      .set('Authorization', `Bearer ${token}`)
      .send({ name: `${testDescription}_label`, color: '#FF0000' });
    expect(res.status).toBe(403);
    expect(res.body.message).toContain(
      'The organization has reached the maximum limit of this resource'
    );
  });

  // Deletion
  it('total should decrease by 1', async () => {
    await prismaTest.organizationLabelUsage.update({
      where: { organizationId: organization.id },
      data: { totalLabels: 1 },
    });

    const res = await request(app)
      .delete(`/api/labels/${label.id}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);

    const labelOrgTotal = await prismaTest.organizationLabelUsage.findUnique({
      where: { organizationId: organization.id },
      select: { totalLabels: true },
    });

    const totalCount = labelOrgTotal!.totalLabels;
    expect(totalCount).toEqual(0);
  });

  // Multi-Org: Organization limits are segregated
  it('Org 2 should have status 403, Org 3 should have status 201', async () => {
    await prismaTest.organizationLabelUsage.update({
      where: { organizationId: organization2.id },
      data: { totalLabels: 100 },
    });
    await prismaTest.organizationLabelUsage.update({
      where: { organizationId: organization3.id },
      data: { totalLabels: 0 },
    });
    const res2 = await request(app)
      .post(`/api/labels`)
      .set('Authorization', `Bearer ${token2}`)
      .send({ name: `${testDescription}_label`, color: '#FDA4BA' });
    const res3 = await request(app)
      .post(`/api/labels`)
      .set('Authorization', `Bearer ${token3}`)
      .send({ name: `${testDescription}_label`, color: '#87AE73' });

    expect(res2.status).toBe(403);
    expect(res2.body.message).toContain(
      'The organization has reached the maximum limit of this resource'
    );
    expect(res3.status).toBe(201);
    expect(res3.body.message).toContain('Label created successfully');
  });
});
