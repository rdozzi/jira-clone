import { describe, expect, afterAll, beforeAll, it } from '@jest/globals';
import { OrganizationRole, Organization, User, Project } from '@prisma/client';

import { app } from '../../src/app';
import request from 'supertest';
import { prismaTest } from '../../src/lib/prismaTestClient';

import { createOrganization } from '../../src/utilities/testUtilities/createOrganization';
import { createProject } from '../../src/utilities/testUtilities/createProject';
import { createProjectMember } from '../../src/utilities/testUtilities/createProjectMember';
import { createOrgCountRecords } from '../../src/utilities/testUtilities/createOrgCountRecords';
import { createUserProfile } from '../../src/utilities/testUtilities/createUserProfile';
import generateJwtToken from '../../src/utilities/testUtilities/generateJwtToken';
import { resetTestDatabase } from '../../src/utilities/testUtilities/resetTestDatabase';
import { redisClient } from '../../src/lib/connectRedis';

describe('Test user counters', () => {
  let token: string;
  let token2: string;
  let token3: string;
  let user: User;
  let user2: User;
  let user3: User;
  let organization: Organization;
  let organization2: Organization;
  let organization3: Organization;
  let project: Project;
  const testDescription = 'TestUserCounters';
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
    project = await createProject(
      prismaTest,
      testDescription,
      user.id,
      organization.id
    );
    await createProjectMember(
      prismaTest,
      project.id,
      user.id,
      'ADMIN',
      organization.id
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
  });
  afterAll(async () => {
    await redisClient.quit();
    await prismaTest.$disconnect();
  });

  // Happy Path (Increment + Total)
  it('org-level user should be 1', async () => {
    await request(app)
      .post('/api/users')
      .set('Authorization', `Bearer ${token}`)
      .send({
        email: 'createAUser@example.com',
        firstName: 'Leonard',
        lastName: 'Nimoy',
        password: 'Test1234!',
        organizationRole: OrganizationRole.USER,
      });

    const userOrgTotal = await prismaTest.organizationUserUsage.findUnique({
      where: { organizationId: organization.id },
      select: { totalUsers: true },
    });

    const totalCount = userOrgTotal!.totalUsers;
    expect(totalCount).toEqual(1);

    await prismaTest.user.delete({
      where: { email: 'createAUser@example.com' },
    });
  });

  // Off-by-one boundary
  it('org-level user count should be 1000', async () => {
    await prismaTest.organizationUserUsage.update({
      where: { organizationId: organization.id },
      data: { totalUsers: 999 },
    });
    const res = await request(app)
      .post('/api/users')
      .set('Authorization', `Bearer ${token}`)
      .send({
        email: 'createAUser@example.com',
        firstName: 'Leonard',
        lastName: 'Nimoy',
        password: 'Test1234!',
        organizationRole: OrganizationRole.USER,
      });

    expect(res.status).toBe(201);

    const userOrgTotal = await prismaTest.organizationUserUsage.findUnique({
      where: { organizationId: organization.id },
      select: { totalUsers: true },
    });

    const totalCount = userOrgTotal!.totalUsers;
    expect(totalCount).toEqual(1000);

    await prismaTest.user.delete({
      where: { email: 'createAUser@example.com' },
    });
  });

  // Total limit exceded
  it('should reject creation call due to total limit reached', async () => {
    await prismaTest.organizationProjectUsage.update({
      where: { organizationId: organization.id },
      data: { totalProjects: 1000 },
    });
    const res = await request(app)
      .post('/api/users')
      .set('Authorization', `Bearer ${token}`)
      .send({
        email: 'createAUser@example.com',
        firstName: 'Leonard',
        lastName: 'Nimoy',
        password: 'Test1234!',
        organizationRole: OrganizationRole.USER,
      });
    expect(res.status).toBe(403);
    expect(res.body.message).toContain(
      'The organization has reached the maximum limit of this resource'
    );
  });

  // Multi-Org: Organization limits are segregated
  it('Org 2 should have status 403, Org 3 should have status 201', async () => {
    await prismaTest.organizationUserUsage.update({
      where: { organizationId: organization2.id },
      data: { totalUsers: 1000 },
    });
    await prismaTest.organizationUserUsage.update({
      where: { organizationId: organization3.id },
      data: { totalUsers: 0 },
    });
    const res2 = await request(app)
      .post('/api/users')
      .set('Authorization', `Bearer ${token2}`)
      .send({
        email: 'createAUser2@example.com',
        firstName: 'Leonard',
        lastName: 'Nimoy',
        password: 'Test1234!',
        organizationRole: OrganizationRole.USER,
      });

    const res3 = await request(app)
      .post('/api/users')
      .set('Authorization', `Bearer ${token3}`)
      .send({
        email: 'createAUser3@example.com',
        firstName: 'William',
        lastName: 'Shatner',
        password: 'Test1234!',
        organizationRole: OrganizationRole.USER,
      });
    expect(res2.status).toBe(403);
    expect(res2.body.message).toContain(
      'The organization has reached the maximum limit of this resource'
    );
    expect(res3.status).toBe(201);
    expect(res3.body.message).toContain('User created successfully');
  });
});
