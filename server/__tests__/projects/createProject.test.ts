import { describe, expect, afterAll, beforeAll, it } from '@jest/globals';
import request from 'supertest';

import { GlobalRole, User } from '@prisma/client';
import { app } from '../../src/app';
import { prismaTest } from '../../src/lib/prismaTestClient';

import { resetTestDatabase } from '../../src/utilities/testUtilities/resetTestDatabase';
import { createUserProfile } from '../../src/utilities/testUtilities/createUserProfile';
import { generateJwtToken } from '../../src/utilities/testUtilities/generateJwtToken';

describe('Create a project', () => {
  let token: string;
  let user: User;
  const testDescription = 'createAProject';
  beforeAll(async () => {
    await prismaTest.$connect();
    await resetTestDatabase();
    user = await createUserProfile(
      prismaTest,
      testDescription,
      GlobalRole.ADMIN
    );
    token = generateJwtToken(user.id, user.globalRole);
  });
  afterAll(async () => {
    await prismaTest.$disconnect();
  });

  it('should create a project', async () => {
    const res = await request(app)
      .post(`/api/projects`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: `Name_${testDescription}`,
        description: `Description_${testDescription}`,
        ownerId: user.id,
      });
    expect(res.status).toBe(201);
    expect(res.body).toEqual(
      expect.objectContaining({
        data: {
          id: expect.any(Number),
          name: expect.any(String),
          ownerId: expect.any(Number),
          description: expect.any(String),
          status: expect.any(String),
          isPublic: expect.any(Boolean),
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        },
        message: expect.any(String),
      })
    );
  });
  it('should add that user to the project', async () => {
    const res = await request(app)
      .post(`/api/projects`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: `Name_${testDescription}`,
        description: `Description_${testDescription}`,
        ownerId: user.id,
      });

    console.log(res.body);

    const projectMember = await prismaTest.projectMember.findUnique({
      where: {
        userId_projectId: {
          userId: user.id,
          projectId: res.body.data.id,
        },
      },
    });

    expect(projectMember).toBeDefined();
  });
});
