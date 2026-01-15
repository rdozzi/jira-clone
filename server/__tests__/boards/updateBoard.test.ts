import { describe, expect, afterAll, beforeAll, it } from '@jest/globals';
import request from 'supertest';

import {
  Board,
  Project,
  User,
  ProjectRole,
  Organization,
  OrganizationRole,
} from '@prisma/client';
import { app } from '../../src/app';
import { prismaTest } from '../../src/lib/prismaTestClient';
import { createUserProfile } from '../../src/utilities/testUtilities/createUserProfile';
import { createOrganization } from '../../src/utilities/testUtilities/createOrganization';
import { createProject } from '../../src/utilities/testUtilities/createProject';
import { createBoard } from '../../src/utilities/testUtilities/createBoard';
import { createProjectMember } from '../../src/utilities/testUtilities/createProjectMember';
import { resetTestDatabase } from '../../src/utilities/testUtilities/resetTestDatabase';
import { generateJwtToken } from '../../src/utilities/testUtilities/generateJwtToken';
import { createOrgCountRecords } from '../../src/utilities/testUtilities/createOrgCountRecords';

describe('Update Board', () => {
  let token: string;
  let user: User;
  let project: Project;
  let board: Board;
  let organization: Organization;

  const testDescription = 'updateBoard';
  beforeAll(async () => {
    await prismaTest.$connect();
    await resetTestDatabase();
    organization = await createOrganization(prismaTest, testDescription);
    await createOrgCountRecords(prismaTest, organization.id);
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
    project = await createProject(
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
      ProjectRole.ADMIN,
      organization.id
    );
  });
  afterAll(async () => {
    await prismaTest.$disconnect();
  });

  it("updates the board's information", async () => {
    const res = await request(app)
      .patch(`/api/boards/${board.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: `Name_${testDescription}_UPDATE`,
      });
    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Board updated successfully');
    expect(res.body.data).toEqual({
      id: expect.any(Number),
      name: `Name_${testDescription}_UPDATE`,
      projectId: expect.any(Number),
      description: expect.any(String),
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
      organizationId: expect.any(Number),
    });
  });
});
