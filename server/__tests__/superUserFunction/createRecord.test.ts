import { describe, expect, afterAll, beforeAll, it } from '@jest/globals';
import request from 'supertest';

import { User, OrganizationRole, Organization, Project } from '@prisma/client';
import { app } from '../../src/app';
import { prismaTest } from '../../src/lib/prismaTestClient';
import { createOrganization } from '../../src/utilities/testUtilities/createOrganization';
import { createSuperUser } from '../../src/utilities/testUtilities/createSuperUser';
import { createUserProfile } from '../../src/utilities/testUtilities/createUserProfile';
import { createProject } from '../../src/utilities/testUtilities/createProject';
import { resetTestDatabase } from '../../src/utilities/testUtilities/resetTestDatabase';
import { generateJwtToken } from '../../src/utilities/testUtilities/generateJwtToken';

describe('Create Record with SuperUser', () => {
  let token: string;
  let user: User;
  let superUser: User;
  let organization: Organization;
  let project: Project;

  const testDescription = 'createRecord';

  beforeAll(async () => {
    await prismaTest.$connect();
    await resetTestDatabase();
    organization = await createOrganization(prismaTest, testDescription);
    user = await createUserProfile(
      prismaTest,
      testDescription,
      OrganizationRole.USER,
      organization.id
    );
    superUser = await createSuperUser(prismaTest, `${testDescription}-1`);
    project = await createProject(
      prismaTest,
      testDescription,
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
      .post(`/api/superuser/function/BOARD/${organization.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: `Name_${testDescription}`,
        description: `Description_${testDescription}`,
        projectId: project.id,
        organizationId: organization.id,
      });
    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Record created successfully');
  });
});
