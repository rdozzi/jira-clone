import { describe, expect, afterAll, beforeAll, it } from '@jest/globals';
import { ResourceType } from '../../src/types/ResourceAndColumnTypes';
import {
  OrganizationRole,
  Organization,
  User,
  Project,
  Attachment,
} from '@prisma/client';

import { app } from '../../src/app';
import request from 'supertest';
import { prismaTest } from '../../src/lib/prismaTestClient';
import { redisClient, connectRedis } from '../../src/lib/connectRedis';

import { createOrganization } from '../../src/utilities/testUtilities/createOrganization';
import { createProject } from '../../src/utilities/testUtilities/createProject';
import { createProjectMember } from '../../src/utilities/testUtilities/createProjectMember';
import { createOrgCountRecords } from '../../src/utilities/testUtilities/createOrgCountRecords';
import { createUserProfile } from '../../src/utilities/testUtilities/createUserProfile';
import { createTestAttachment } from '../../src/utilities/testUtilities/createAttachments';
import { createTestFile } from '../../src/utilities/testUtilities/createTestFile';
import generateJwtToken from '../../src/utilities/testUtilities/generateJwtToken';
import {
  DAILY_ORG_LIMITS,
  TOTAL_ORG_LIMITS,
} from '../../src/services/organizationUsageServices/limits';
import { deleteRedisKey } from '../../src/utilities/testUtilities/deleteRedisKey';
import { deleteUploads } from '../../src/utilities/testUtilities/deleteUploads';
import { resetTestDatabase } from '../../src/utilities/testUtilities/resetTestDatabase';

describe('Test file storage counters', () => {
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
  let project2: Project;
  let project3: Project;
  const resourceType: ResourceType = 'FileStorage';
  const testDescription = 'TestFileStorageCounters';
  let attachment: Attachment;
  beforeAll(async () => {
    await prismaTest.$connect();
    await connectRedis();
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
    project2 = await createProject(
      prismaTest,
      testDescription,
      user2.id,
      organization2.id
    );
    project3 = await createProject(
      prismaTest,
      testDescription,
      user3.id,
      organization3.id
    );

    await createProjectMember(
      prismaTest,
      project.id,
      user.id,
      'ADMIN',
      organization.id
    );

    await createProjectMember(
      prismaTest,
      project2.id,
      user2.id,
      'ADMIN',
      organization2.id
    );

    await createProjectMember(
      prismaTest,
      project3.id,
      user3.id,
      'ADMIN',
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
  });

  afterAll(async () => {
    await deleteRedisKey(organization.id, resourceType);
    deleteUploads();
    await prismaTest.$disconnect();
  });

  // Happy Path
  it('daily and org-level project should be 1', async () => {
    const file = createTestFile(2, '2b.bin');
    await request(app)
      .post(`/api/attachments/single`)
      .set('Authorization', `Bearer ${token}`)
      .field('entityType', 'PROJECT')
      .field('entityId', project.id)
      .attach('file', file);

    const key = `org:${organization.id}:${resourceType}:daily`;
    const dailyFileSize = Number(await redisClient.get(key));
    expect(dailyFileSize).toBe(2);

    const fileStorageTotal =
      await prismaTest.organizationFileStorageUsage.findUnique({
        where: { organizationId: organization.id },
        select: { totalFileStorage: true },
      });

    const totalCount = fileStorageTotal!.totalFileStorage;
    expect(totalCount).toBe(2);
  });

  // Meet daily and total limit boundary
  it('daily and org-level file storage should be close to respective limits', async () => {
    const file = createTestFile(1, '1b.bin');
    const key = `org:${organization.id}:${resourceType}:daily`;

    await redisClient.set(key, DAILY_ORG_LIMITS['FileStorage'] - 1);
    await prismaTest.organizationFileStorageUsage.update({
      where: { organizationId: organization.id },
      data: { totalFileStorage: TOTAL_ORG_LIMITS['FileStorage'] - 1 },
    });
    const res = await request(app)
      .post(`/api/attachments/single`)
      .set('Authorization', `Bearer ${token}`)
      .field('entityType', 'PROJECT')
      .field('entityId', project.id)
      .attach('file', file);

    expect(res.status).toBe(201);
    const dailyCount = Number(await redisClient.get(key));
    expect(dailyCount).toBe(DAILY_ORG_LIMITS['FileStorage']);

    const projectFileStorageTotal =
      await prismaTest.organizationFileStorageUsage.findUnique({
        where: { organizationId: organization.id },
        select: { totalFileStorage: true },
      });

    const totalCount = projectFileStorageTotal!.totalFileStorage;
    expect(totalCount).toBe(TOTAL_ORG_LIMITS['FileStorage']);
  });

  // Daily limit exceded
  it('should reject creation call due to daily limit reached', async () => {
    const file = createTestFile(1, '1b.bin');
    const key = `org:${organization.id}:${resourceType}:daily`;
    await redisClient.set(key, DAILY_ORG_LIMITS['FileStorage']);
    const res = await request(app)
      .post(`/api/attachments/single`)
      .set('Authorization', `Bearer ${token}`)
      .field('entityType', 'PROJECT')
      .field('entityId', project.id)
      .attach('file', file);
    expect(res.status).toBe(429);
    expect(res.body.message).toContain(
      'Requests exceeds daily limit for this resource'
    );
  });

  // Total limit exceded
  it('should reject creation call due to total limit reached', async () => {
    const file = createTestFile(1, '1b.bin');
    const key = `org:${organization.id}:${resourceType}:daily`;
    await redisClient.set(key, 0);
    await prismaTest.organizationFileStorageUsage.update({
      where: { organizationId: organization.id },
      data: { totalFileStorage: TOTAL_ORG_LIMITS['FileStorage'] },
    });
    const res = await request(app)
      .post(`/api/attachments/single`)
      .set('Authorization', `Bearer ${token}`)
      .field('entityType', 'PROJECT')
      .field('entityId', project.id)
      .attach('file', file);
    expect(res.status).toBe(403);
    expect(res.body.message).toContain(
      'The organization has reached the maximum limit of this resource'
    );
  });

  // Deletion
  it('total should decrease by file size, daily should stay the same', async () => {
    await prismaTest.attachment.deleteMany({
      where: { organizationId: organization.id },
    });

    await prismaTest.organizationFileStorageUsage.update({
      where: { organizationId: organization.id },
      data: { totalFileStorage: 0 },
    });

    attachment = await createTestAttachment(
      prismaTest,
      testDescription,
      project.id,
      'PROJECT',
      user.id,
      'jpg',
      organization.id
    );

    const key = `org:${organization.id}:${resourceType}:daily`;
    await redisClient.set(key, 37118); // image1.jpg = 37118 bytes

    const res = await request(app)
      .delete(`/api/attachments/${attachment.id}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    const dailyCount = Number(await redisClient.get(key));
    expect(dailyCount).toEqual(37118);

    const fileStorageOrgTotal =
      await prismaTest.organizationFileStorageUsage.findUnique({
        where: { organizationId: organization.id },
        select: { totalFileStorage: true },
      });

    const totalCount = fileStorageOrgTotal!.totalFileStorage;
    expect(totalCount).toEqual(0);
  });

  // Multi-Org: Organization limits are segregated
  it('Org 2 should have status 403, Org 3 should have status 201', async () => {
    const file2 = createTestFile(1, '1b.bin');
    const file3 = createTestFile(1, '1b.bin');

    await prismaTest.organizationFileStorageUsage.update({
      where: { organizationId: organization2.id },
      data: { totalFileStorage: TOTAL_ORG_LIMITS['FileStorage'] },
    });

    await prismaTest.organizationFileStorageUsage.update({
      where: { organizationId: organization3.id },
      data: { totalFileStorage: 0 },
    });

    const res2 = await request(app)
      .post(`/api/attachments/single`)
      .set('Authorization', `Bearer ${token2}`)
      .field('entityType', 'PROJECT')
      .field('entityId', project2.id)
      .attach('file', file2);

    const res3 = await request(app)
      .post(`/api/attachments/single`)
      .set('Authorization', `Bearer ${token3}`)
      .field('entityType', 'PROJECT')
      .field('entityId', project3.id)
      .attach('file', file3);

    expect(res2.status).toBe(403);
    expect(res2.body.message).toContain(
      'The organization has reached the maximum limit of this resource: FileStorage.'
    );
    expect(res3.status).toBe(201);
    expect(res3.body.message).toContain('File uploaded successfully');
  });

  // Ensure daily key expires after 23:59 local time
  it('Daily key expires after 23:59 at the given time', async () => {
    const file = createTestFile(1, '1b.bin');
    const key = `org:${organization.id}:${resourceType}:daily`;
    await redisClient.del(key);
    await request(app)
      .post(`/api/attachments/single`)
      .set('Authorization', `Bearer ${token}`)
      .field('entityType', 'PROJECT')
      .field('entityId', project.id)
      .attach('file', file);

    const todayEnd = new Date();
    todayEnd.setUTCHours(23, 59, 59, 999);
    const EXPIRE_TIME = Math.floor(todayEnd.getTime() / 1000);
    const testKey = 'testKey';
    await redisClient.set(testKey, 'Test Key for checking expiration time');
    await redisClient.expireAt(testKey, EXPIRE_TIME);
    const testKeyTTL = await redisClient.ttl(testKey);

    const ttl = Number(await redisClient.ttl(key));
    expect(ttl).toBeGreaterThan(0);
    expect(Math.abs(ttl - testKeyTTL)).toBeLessThanOrEqual(1);
  });
});
