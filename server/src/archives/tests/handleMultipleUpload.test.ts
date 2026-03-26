// import { describe, expect, afterAll, beforeAll, it } from '@jest/globals';
// import request from 'supertest';

// import {
//   User,
//   ProjectRole,
//   Ticket,
//   Comment,
//   OrganizationRole,
//   Organization,
// } from '@prisma/client';
// import { app } from '../../app';
// import path from 'path';
// import fs from 'fs/promises';
// import { prismaTest } from '../../lib/prismaTestClient';
// import { createOrganization } from '../../utilities/testUtilities/createOrganization';
// import { resetTestDatabase } from '../../utilities/testUtilities/resetTestDatabase';
// import { createUserProfile } from '../../utilities/testUtilities/createUserProfile';
// import { createProject } from '../../utilities/testUtilities/createProject';
// import { createBoard } from '../../utilities/testUtilities/createBoard';
// import { createTicket } from '../../utilities/testUtilities/createTicket';
// import { createComment } from '../../utilities/testUtilities/createComment';
// import { createProjectMember } from '../../utilities/testUtilities/createProjectMember';
// import { generateJwtToken } from '../../utilities/testUtilities/generateJwtToken';
// import { createOrgCountRecords } from '../../utilities/testUtilities/createOrgCountRecords';
// import { deleteRedisKey } from '../../utilities/testUtilities/deleteRedisKey';
// import { deleteUploads } from '../../utilities/testUtilities/deleteUploads';
// import { ResourceType } from '../../types/ResourceAndColumnTypes';
// import waitForExpect from 'wait-for-expect';

// // Multiple Upload route and controller removed for MVP

// describe.skip('handleMultipleUpload', () => {
//   const testDescription = 'handleMultipleUpload';
//   let user1: User;
//   let token: string;
//   let ticket: Ticket | undefined;
//   let comment: Comment;
//   let organization: Organization;
//   const resourceType: ResourceType = 'FileStorage';

//   beforeAll(async () => {
//     await prismaTest.$connect();
//     await resetTestDatabase();
//     organization = await createOrganization(prismaTest, testDescription);
//     await createOrgCountRecords(prismaTest, organization.id);
//     user1 = await createUserProfile(
//       prismaTest,
//       `${testDescription}_user1`,
//       OrganizationRole.USER,
//       organization.id,
//     );
//     token = generateJwtToken(
//       user1.id,
//       user1.globalRole,
//       user1.organizationId,
//       user1.organizationRole,
//     );
//     const project = await createProject(
//       prismaTest,
//       testDescription,
//       user1.id,
//       organization.id,
//     );
//     const board = await createBoard(
//       prismaTest,
//       testDescription,
//       project.id,
//       organization.id,
//     );
//     ticket = await createTicket(
//       prismaTest,
//       testDescription,
//       board.id,
//       user1.id,
//       organization.id,
//     );
//     comment = await createComment(
//       prismaTest,
//       testDescription,
//       ticket.id,
//       user1.id,
//       organization.id,
//     );
//     await createProjectMember(
//       prismaTest,
//       project.id,
//       user1.id,
//       ProjectRole.USER,
//       organization.id,
//     );
//   });
//   afterAll(async () => {
//     await deleteRedisKey(organization.id, resourceType);
//     await deleteUploads();
//     await prismaTest.$disconnect();
//   });

//   it('should upload multiple attachments', async () => {
//     const fixtureDir = path.join(
//       __dirname,
//       '../../src/utilities/testUtilities/__fixtures__',
//     );
//     const files = await fs.readdir(fixtureDir);

//     const req = request(app)
//       .post(`/api/attachments/many`)
//       .set('Authorization', `Bearer ${token}`)
//       .field('entityType', 'COMMENT')
//       .field('entityId', comment.id);

//     for (const file of files) {
//       const fullPath = path.join(fixtureDir, file);
//       req.attach('files', fullPath);
//     }

//     const res = await req;

//     expect(res.status).toBe(201);
//     expect(res.body.message).toEqual(`${files.length} uploaded successfully`);

//     // Activity Log for Multiple uploads
//     await waitForExpect(async () => {
//       const activityLogs = await prismaTest.activityLog.findMany({
//         where: { organizationId: organization.id },
//       });
//       expect(activityLogs.length).toEqual(5);
//       expect(activityLogs[0]).toEqual({
//         id: expect.any(Number),
//         userId: expect.any(Number),
//         actorType: expect.any(String),
//         action: expect.any(String),
//         targetId: expect.any(Number),
//         targetType: expect.any(String),
//         metadata: expect.objectContaining({
//           commentId: expect.any(Number),
//           filename: expect.any(String),
//           mimetype: expect.any(String),
//           savedPath: expect.any(String),
//           size: expect.any(Number),
//           storageType: expect.any(String),
//         }),
//         createdAt: expect.any(Date),
//         organizationId: expect.any(Number),
//       });
//     });
//   });
// });
