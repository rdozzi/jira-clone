import { describe, expect, afterAll, beforeAll, it } from '@jest/globals';
import request from 'supertest';

import {
  Board,
  OrganizationRole,
  Organization,
  Project,
  Ticket,
  User,
  ProjectRole,
} from '@prisma/client';
import { app } from '../../src/app';
import { prismaTest } from '../../src/lib/prismaTestClient';
import { createOrganization } from '../../src/utilities/testUtilities/createOrganization';
import { createSuperUser } from '../../src/utilities/testUtilities/createSuperUser';
import { createProject } from '../../src/utilities/testUtilities/createProject';
import { createBoard } from '../../src/utilities/testUtilities/createBoard';
import { createTicket } from '../../src/utilities/testUtilities/createTicket';
import { createProjectMember } from '../../src/utilities/testUtilities/createProjectMember';
import { resetTestDatabase } from '../../src/utilities/testUtilities/resetTestDatabase';
import { generateJwtToken } from '../../src/utilities/testUtilities/generateJwtToken';
import { createUserProfile } from '../../src/utilities/testUtilities/createUserProfile';
import { createOrgCountRecords } from '../../src/utilities/testUtilities/createOrgCountRecords';

describe('Update Record', () => {
  let token: string;
  let superUser: User;
  let user: User;
  let project: Project;
  let board: Board;
  let ticket: Ticket;
  let organization: Organization;

  const testDescription = 'updateRecord';
  beforeAll(async () => {
    await prismaTest.$connect();
    await resetTestDatabase();
    organization = await createOrganization(prismaTest, testDescription);
    await createOrgCountRecords(prismaTest, organization.id);
    superUser = await createSuperUser(prismaTest, testDescription);
    user = await createUserProfile(
      prismaTest,
      testDescription,
      OrganizationRole.USER,
      organization.id
    );
    project = await createProject(
      prismaTest,
      testDescription,
      superUser.id,
      organization.id
    );
    board = await createBoard(
      prismaTest,
      testDescription,
      project.id,
      organization.id
    );
    ticket = await createTicket(
      prismaTest,
      testDescription,
      board.id,
      user.id,
      organization.id
    );
    await createProjectMember(
      prismaTest,
      project.id,
      user.id,
      ProjectRole.USER,
      organization.id
    );
    token = generateJwtToken(superUser.id, superUser.globalRole, null, null);
  });
  afterAll(async () => {
    await prismaTest.$disconnect();
  });

  it("updates the user's information", async () => {
    const res = await request(app)
      .patch(`/api/superuser/function/TICKET/${organization.id}/${ticket.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: `${testDescription}_TITLE_UPDATE`,
        description: `${testDescription}_DESCRIPTION_UPDATE`,
      });
    expect(res.status).toBe(200);
    expect(res.body.message).toBe(`Record updated successfully`);
    expect(res.body.data).toEqual({
      id: expect.any(Number),
      title: `${testDescription}_TITLE_UPDATE`,
      description: `${testDescription}_DESCRIPTION_UPDATE`,
      status: expect.any(String),
      priority: expect.any(String),
      type: expect.any(String),
      assigneeId: expect.any(Number),
      reporterId: expect.any(Number),
      boardId: expect.any(Number),
      dueDate: null,
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
      organizationId: expect.any(Number),
    });
  });
});
