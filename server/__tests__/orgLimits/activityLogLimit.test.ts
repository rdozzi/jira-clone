import { describe, expect, afterAll, beforeAll, it } from '@jest/globals';
import { OrganizationRole, Organization, User, Project } from '@prisma/client';

import { app } from '../../src/app';
import request from 'supertest';
import { prismaTest } from '../../src/lib/prismaTestClient';
import { redisClient, connectRedis } from '../../src/lib/connectRedis';
import waitForExpect from 'wait-for-expect';

import { createOrganization } from '../../src/utilities/testUtilities/createOrganization';
import { createProject } from '../../src/utilities/testUtilities/createProject';
import { createProjectMember } from '../../src/utilities/testUtilities/createProjectMember';
import { createOrgCountRecords } from '../../src/utilities/testUtilities/createOrgCountRecords';
import { createUserProfile } from '../../src/utilities/testUtilities/createUserProfile';
import generateJwtToken from '../../src/utilities/testUtilities/generateJwtToken';
import { resetTestDatabase } from '../../src/utilities/testUtilities/resetTestDatabase';
import { ResourceType } from '../../src/types/ResourceAndColumnTypes';

describe.skip('Test activity log counters', () => {
  let token: string;
  let user: User;
  let organization: Organization;
  let project: Project;
  const testDescription = 'TestActivityLogCounters';
  const resourceType: ResourceType = 'Project';
  beforeAll(async () => {
    await prismaTest.$connect();
    await resetTestDatabase();
    await connectRedis();
    organization = await createOrganization(prismaTest, testDescription);
    await createOrgCountRecords(prismaTest, organization.id);
    user = await createUserProfile(
      prismaTest,
      testDescription,
      OrganizationRole.ADMIN,
      organization.id
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
  });
  afterAll(async () => {
    await redisClient.quit();
    await prismaTest.$disconnect();
  });

  // Happy Path (Increment + Total)
  it('org-level activity log should be 1', async () => {
    const key = `org:${organization.id}:${resourceType}:daily`;
    await redisClient.set(key, 0);
    const res = await request(app)
      .post(`/api/projects`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: `Name_${testDescription}`,
        description: `Description_${testDescription}`,
      });

    const projectId = res.body.data.id;

    const activityLog = await prismaTest.activityLog.findMany({
      where: {
        organizationId: organization.id,
        targetId: projectId,
      },
    });

    expect(activityLog.length).toBe(1);

    await waitForExpect(async () => {
      const activityLogOrgTotal =
        await prismaTest.organizationActivityLogUsage.findUnique({
          where: { organizationId: organization.id },
        });

      const totalCount = activityLogOrgTotal!.totalActivityLogs;
      expect(totalCount).toBe(1);
    });

    await prismaTest.projectMember.deleteMany({
      where: { organizationId: organization.id, projectId: projectId },
    });

    await prismaTest.project.deleteMany({ where: { id: projectId } });

    await prismaTest.activityLog.delete({
      where: { id: activityLog[0].id },
    });
  });

  // Check Prune Function
  it('should prune 1000 records from activity log that matches the org id', async () => {
    await prismaTest.activityLog.createMany({
      data: Array.from({ length: 1000 }).map((_, i) => ({
        userId: user.id,
        actorType: 'USER',
        action: 'ADD_RECORDS',
        targetId: project.id,
        targetType: 'PROJECT',
        organizationId: organization.id,
        metadata: { count: i },
      })),
    });

    await prismaTest.organizationActivityLogUsage.update({
      where: { organizationId: organization.id },
      data: { totalActivityLogs: 49999 }, // limit for activity logs is 50000
    });

    await request(app)
      .post(`/api/projects`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: `Name_${testDescription}`,
        description: `Description_${testDescription}`,
      });

    await waitForExpect(async () => {
      const countAfterPrune =
        await prismaTest.organizationActivityLogUsage.findUnique({
          where: { organizationId: organization.id },
          select: { totalActivityLogs: true },
        });

      expect(countAfterPrune?.totalActivityLogs).toEqual(49000);

      const record = await prismaTest.activityLog.findMany({
        where: { organizationId: organization.id },
      });

      expect(record.length).toEqual(1);
      expect(record[0].metadata).toEqual({
        projectName: `Name_${testDescription}`,
        projectDescription: `Description_${testDescription}`,
        projectOwnerId: user.id,
        projectRole: expect.any(String),
      });
    });
  });
});
