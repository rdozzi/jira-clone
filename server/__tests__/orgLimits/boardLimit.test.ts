import { describe, expect, afterAll, beforeAll, it } from '@jest/globals';
import { ResourceType } from '../../src/types/ResourceAndColumnTypes';
import {
  OrganizationRole,
  Organization,
  User,
  Project,
  Board,
} from '@prisma/client';

import { app } from '../../src/app';
import request from 'supertest';
import { prismaTest } from '../../src/lib/prismaTestClient';
import { redisClient, connectRedis } from '../../src/lib/connectRedis';

import { createOrganization } from '../../src/utilities/testUtilities/createOrganization';
import { createProject } from '../../src/utilities/testUtilities/createProject';
import { createBoard } from '../../src/utilities/testUtilities/createBoard';
import { createProjectMember } from '../../src/utilities/testUtilities/createProjectMember';
import { createOrgCountRecords } from '../../src/utilities/testUtilities/createOrgCountRecords';
import { createUserProfile } from '../../src/utilities/testUtilities/createUserProfile';
import generateJwtToken from '../../src/utilities/testUtilities/generateJwtToken';
import { deleteRedisKey } from '../../src/utilities/testUtilities/deleteRedisKey';
import { resetTestDatabase } from '../../src/utilities/testUtilities/resetTestDatabase';

describe('Test board counters', () => {
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
  let board: Board;
  const resourceType: ResourceType = 'Board';
  const testDescription = 'TestBoardCounters';
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

    board = await createBoard(
      prismaTest,
      testDescription,
      project.id,
      organization.id
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
    await prismaTest.$disconnect();
  });

  // Happy Path (Increment + Total)
  it('daily and org-level board should be 1', async () => {
    const res = await request(app)
      .post(`/api/boards`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: `Name_${testDescription}`,
        description: `Description_${testDescription}`,
        projectId: project.id,
      });

    expect(res.status).toEqual(201);

    const key = `org:${organization.id}:${resourceType}:daily`;
    const dailyCount = Number(await redisClient.get(key));

    expect(dailyCount).toEqual(1);

    const boardOrgTotal = await prismaTest.organizationBoardUsage.findUnique({
      where: { organizationId: organization.id },
      select: { totalBoards: true },
    });

    const totalCount = boardOrgTotal!.totalBoards;
    expect(totalCount).toEqual(1);

    const boardId = res.body.data.id;

    await prismaTest.board.deleteMany({ where: { id: boardId } });
  });

  // Off-by-one boundary
  it('daily and org-level project should be 10 and 50 respectively', async () => {
    const key = `org:${organization.id}:${resourceType}:daily`;
    await redisClient.set(key, 9);
    await prismaTest.organizationBoardUsage.update({
      where: { organizationId: organization.id },
      data: { totalBoards: 49 },
    });

    const res = await request(app)
      .post(`/api/boards`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: `Name_${testDescription}`,
        description: `Description_${testDescription}`,
        projectId: project.id,
      });

    expect(res.status).toBe(201);
    const dailyCount = Number(await redisClient.get(key));
    expect(dailyCount).toEqual(10);

    const boardOrgTotal = await prismaTest.organizationBoardUsage.findUnique({
      where: { organizationId: organization.id },
      select: { totalBoards: true },
    });

    const totalCount = boardOrgTotal!.totalBoards;
    expect(totalCount).toEqual(50);

    const boardId = res.body.data.id;

    await prismaTest.board.deleteMany({ where: { id: boardId } });
  });

  // Daily limit exceded
  it('should reject creation call due to daily limit reached', async () => {
    const key = `org:${organization.id}:${resourceType}:daily`;
    await redisClient.set(key, 20);
    const res = await request(app)
      .post(`/api/boards`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: `Name_${testDescription}`,
        description: `Description_${testDescription}`,
        projectId: project.id,
      });
    expect(res.status).toBe(429);
    expect(res.body.message).toContain(
      'Requests exceeds daily limit for this resource'
    );
  });

  // Total limit exceded
  it('should reject creation call due to total limit reached', async () => {
    const key = `org:${organization.id}:${resourceType}:daily`;
    await redisClient.set(key, 0);
    await prismaTest.organizationBoardUsage.update({
      where: { organizationId: organization.id },
      data: { totalBoards: 50 },
    });
    const res = await request(app)
      .post(`/api/boards`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: `Name_${testDescription}`,
        description: `Description_${testDescription}`,
        projectId: project.id,
      });
    expect(res.status).toBe(403);
    expect(res.body.message).toContain(
      'The organization has reached the maximum limit of this resource'
    );
  });

  // Deletion
  it('total should decrease by 1, daily should stay the same', async () => {
    const key = `org:${organization.id}:${resourceType}:daily`;
    await redisClient.set(key, 1);
    await prismaTest.organizationBoardUsage.update({
      where: { organizationId: organization.id },
      data: { totalBoards: 1 },
    });
    const res = await request(app)
      .delete(`/api/boards/${board.id}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);

    const dailyCount = Number(await redisClient.get(key));
    expect(dailyCount).toEqual(1);

    const boardOrgTotal = await prismaTest.organizationBoardUsage.findUnique({
      where: { organizationId: organization.id },
      select: { totalBoards: true },
    });

    const totalCount = boardOrgTotal!.totalBoards;
    expect(totalCount).toEqual(0);
  });

  // Multi-Org: Organization limits are segregated
  it('Org 2 should have status 403, Org 3 should have status 201', async () => {
    await prismaTest.organizationBoardUsage.update({
      where: { organizationId: organization2.id },
      data: { totalBoards: 50 },
    });
    await prismaTest.organizationBoardUsage.update({
      where: { organizationId: organization3.id },
      data: { totalBoards: 0 },
    });
    const res2 = await request(app)
      .post(`/api/boards`)
      .set('Authorization', `Bearer ${token2}`)
      .send({
        name: `Name_${testDescription}_2`,
        description: `Description_${testDescription}_2`,
        projectId: project2.id,
      });
    const res3 = await request(app)
      .post(`/api/boards`)
      .set('Authorization', `Bearer ${token3}`)
      .send({
        name: `Name_${testDescription}_3`,
        description: `Description_${testDescription}_3`,
        projectId: project3.id,
      });

    expect(res2.status).toBe(403);
    expect(res2.body.message).toContain(
      'The organization has reached the maximum limit of this resource'
    );
    expect(res3.status).toBe(201);
    expect(res3.body.message).toContain('Board created successfully');
  });

  // Ensure daily key expires after 23:59 local time
  it('Daily key expires after 23:59 at the given time', async () => {
    const key = `org:${organization.id}:${resourceType}:daily`;
    await redisClient.del(key);
    await request(app)
      .post(`/api/boards`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: `Name_${testDescription}`,
        description: `Description_${testDescription}`,
        projectId: project.id,
      });

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
