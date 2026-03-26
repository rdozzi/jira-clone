// import { describe, expect, afterAll, beforeAll, it } from '@jest/globals';
// import request from 'supertest';
// import waitForExpect from 'wait-for-expect';

// import {
//   OrganizationRole,
//   Organization,
//   Ticket,
//   User,
//   Label,
//   ProjectRole,
// } from '@prisma/client';
// import { app } from '../../app';
// import { prismaTest } from '../../lib/prismaTestClient';
// import { createOrganization } from '../../utilities/testUtilities/createOrganization';
// import { createUserProfile } from '../../utilities/testUtilities/createUserProfile';
// import { createProject } from '../../utilities/testUtilities/createProject';
// import { createBoard } from '../../utilities/testUtilities/createBoard';
// import { createTicket } from '../../utilities/testUtilities/createTicket';
// import { createLabel } from '../../utilities/testUtilities/createLabel';
// import { createProjectMember } from '../../utilities/testUtilities/createProjectMember';
// import { resetTestDatabase } from '../../utilities/testUtilities/resetTestDatabase';
// import { generateJwtToken } from '../../utilities/testUtilities/generateJwtToken';
// import { createTicketLabel } from '../../utilities/testUtilities/createTicketLabel';

// describe.skip('Delete label from Ticket', () => {
//   let token: string;
//   let user: User;
//   let ticket: Ticket;
//   let label: Label;
//   let organization: Organization;

//   const testDescription = 'Delete label from Ticket';
//   beforeAll(async () => {
//     await prismaTest.$connect();
//     await resetTestDatabase();
//     organization = await createOrganization(prismaTest, testDescription);
//     user = await createUserProfile(
//       prismaTest,
//       testDescription,
//       OrganizationRole.USER,
//       organization.id,
//     );
//     token = generateJwtToken(
//       user.id,
//       user.globalRole,
//       user.organizationId,
//       user.organizationRole,
//     );
//     const project = await createProject(
//       prismaTest,
//       testDescription,
//       user.id,
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
//       user.id,
//       organization.id,
//     );
//     label = await createLabel(prismaTest, 'label', '#FF0000', organization.id);
//     await createTicketLabel(prismaTest, ticket.id, label.id, organization.id);
//     await createProjectMember(
//       prismaTest,
//       project.id,
//       user.id,
//       ProjectRole.USER,
//       organization.id,
//     );
//   });
//   afterAll(async () => {
//     await prismaTest.$disconnect();
//   });

//   it('should delete a label from a ticket', async () => {
//     const res = await request(app)
//       .delete(`/api/ticket-labels/${ticket.id}/${label.id}`)
//       .set('Authorization', `Bearer ${token}`);
//     expect(res.status).toBe(200);
//     expect(res.body).toEqual({
//       data: {
//         ticketId: ticket.id,
//         labelId: label.id,
//         organizationId: organization.id,
//       },
//       message: 'Label removed successfully',
//     });

//     await waitForExpect(async () => {
//       const ticketLabelRecord = await prismaTest.ticketLabel.findUnique({
//         where: { ticketId_labelId: { ticketId: ticket.id, labelId: label.id } },
//       });

//       expect(ticketLabelRecord).toBeNull();
//     });
//   });
// });
