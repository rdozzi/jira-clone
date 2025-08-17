import { describe, expect, afterAll, beforeAll, it } from '@jest/globals';
import request from 'supertest';

import {
  OrganizationRole,
  Organization,
  User,
  ProjectRole,
  Status,
  Priority,
  Type,
  Board,
} from '@prisma/client';
import { app } from '../../src/app';
import { prismaTest } from '../../src/lib/prismaTestClient';
import { createOrganization } from '../../src/utilities/testUtilities/createOrganization';
import { resetTestDatabase } from '../../src/utilities/testUtilities/resetTestDatabase';
import { createUserProfile } from '../../src/utilities/testUtilities/createUserProfile';
import { createProject } from '../../src/utilities/testUtilities/createProject';
import { createBoard } from '../../src/utilities/testUtilities/createBoard';
import { createProjectMember } from '../../src/utilities/testUtilities/createProjectMember';
import { createOrgCountRecords } from '../../src/utilities/testUtilities/createOrgCountRecords';
import { deleteRedisKey } from '../../src/utilities/testUtilities/deleteRedisKey';
import { generateJwtToken } from '../../src/utilities/testUtilities/generateJwtToken';
import { ResourceType } from '../../src/types/ResourceAndColumnTypes';

describe('Create a ticket', () => {
  let token: string;
  let user: User;
  let board: Board;
  let organization: Organization;
  const resourceType: ResourceType = 'Ticket';

  const testDescription = 'createATicket';
  beforeAll(async () => {
    await prismaTest.$connect();
    await resetTestDatabase();
    organization = await createOrganization(prismaTest, testDescription);
    await createOrgCountRecords(prismaTest, organization.id);
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
    const project = await createProject(
      prismaTest,
      testDescription,
      user.id,
      organization.id
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
      ProjectRole.USER,
      organization.id
    );
  });
  afterAll(async () => {
    await deleteRedisKey(organization.id, resourceType);
    await prismaTest.$disconnect();
  });

  it('should create a ticket', async () => {
    const res = await request(app)
      .post(`/api/tickets`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: `Title_${testDescription}`,
        description: `Description_${testDescription}`,
        status: Status.BACKLOG,
        priority: Priority.HIGH,
        type: Type.STORY,
        assigneeId: user.id,
        reporterId: user.id,
        boardId: board.id,
        dueDate: new Date('30 July 2025 17:00 UTC').toISOString(),
      });
    expect(res.status).toBe(201);
    expect(res.body).toEqual(
      expect.objectContaining({
        data: {
          id: expect.any(Number),
          title: expect.any(String),
          description: expect.any(String),
          status: expect.any(String),
          priority: expect.any(String),
          type: expect.any(String),
          assigneeId: expect.any(Number),
          reporterId: expect.any(Number),
          boardId: expect.any(Number),
          dueDate: expect.any(String),
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
          organizationId: expect.any(Number),
        },
        message: expect.any(String),
      })
    );
  });
});
