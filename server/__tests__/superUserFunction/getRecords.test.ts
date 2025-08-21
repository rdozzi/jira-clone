import { describe, expect, afterAll, beforeAll, it } from '@jest/globals';
import request from 'supertest';

import { User, OrganizationRole, Organization, Ticket } from '@prisma/client';
import { app } from '../../src/app';
import { prismaTest } from '../../src/lib/prismaTestClient';
import { createOrganization } from '../../src/utilities/testUtilities/createOrganization';
import { createSuperUser } from '../../src/utilities/testUtilities/createSuperUser';
import { createUserProfile } from '../../src/utilities/testUtilities/createUserProfile';
import { createProject } from '../../src/utilities/testUtilities/createProject';
import { createBoard } from '../../src/utilities/testUtilities/createBoard';
import { createTicket } from '../../src/utilities/testUtilities/createTicket';
import { resetTestDatabase } from '../../src/utilities/testUtilities/resetTestDatabase';
import { generateJwtToken } from '../../src/utilities/testUtilities/generateJwtToken';
import { createOrgCountRecords } from '../../src/utilities/testUtilities/createOrgCountRecords';

describe('Get Records with SuperUser', () => {
  let token: string;
  let user: User;
  let superUser: User;
  let organization: Organization;
  const testDescription = 'getRecordsWithSuperUser';
  let ticket1: Ticket;

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
    superUser = await createSuperUser(prismaTest, `${testDescription}-1`);
    const project = await createProject(
      prismaTest,
      testDescription,
      user.id,
      organization.id
    );
    const board = await createBoard(
      prismaTest,
      testDescription,
      project.id,
      organization.id
    );
    ticket1 = await createTicket(
      prismaTest,
      `${testDescription}_1`,
      board.id,
      user.id,
      organization.id
    );
    await createTicket(
      prismaTest,
      `${testDescription}_2`,
      board.id,
      user.id,
      organization.id
    );
    await createTicket(
      prismaTest,
      `${testDescription}_3`,
      board.id,
      user.id,
      organization.id
    );
    token = generateJwtToken(superUser.id, superUser.globalRole, null, null);
  });
  afterAll(async () => {
    await prismaTest.$disconnect();
  });

  it('should get all tickets from organization', async () => {
    const res = await request(app)
      .get(`/api/superuser/function/TICKET/${organization.id}/`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Data fetched successfully');
    expect(res.body.data).toHaveLength(3);
  });
  it('should get a single ticket from the organization', async () => {
    const res = await request(app)
      .get(`/api/superuser/function/TICKET/${organization.id}/${ticket1.id}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Data fetched successfully');
    expect(res.body.data).toHaveLength(1);
  });
});
