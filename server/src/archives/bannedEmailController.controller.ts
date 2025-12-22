// import { Request, Response } from 'express';
// import { PrismaClient } from '@prisma/client';
// import { buildLogEvent } from '../services/buildLogEvent';
// import { createResourceService } from '../services/organizationUsageServices/createResourceService';
// import { deleteResourceService } from '../services/organizationUsageServices/deleteResourceService';

// // Get all banned email records
// export async function getAllBannedEmails(
//   req: Request,
//   res: Response,
//   prisma: PrismaClient
// ) {
//   try {
//     const organizationId = res.locals.userInfo.organizationId;
//     const bannedEmailRecords = await prisma.bannedEmail.findMany({
//       where: { organizationId: organizationId },
//     });
//     return res.status(200).json(bannedEmailRecords);
//   } catch (error) {
//     console.error('Error fetching bannedEmail: ', error);
//     return res.status(500).json({ error: 'Failed to fetch bannedEmail' });
//   }
// }

// // Get banned email by Id
// export async function getBannedEmailById(
//   req: Request,
//   res: Response,
//   prisma: PrismaClient
// ) {
//   try {
//     const bannedEmailId = res.locals.validatedParam;
//     const organizationId = res.locals.userInfo.organizationId;

//     // Fetch banned email record by ID
//     const bannedEmailRecord = await prisma.bannedEmail.findUnique({
//       where: { id: bannedEmailId, organizationId: organizationId },
//     });

//     if (!bannedEmailRecord) {
//       return res.status(404).json({ error: 'Banned email not found' });
//     }

//     return res.status(200).json(bannedEmailRecord);
//   } catch (error) {
//     console.error('Error fetching banned email: ', error);
//     return res.status(500).json({ error: 'Failed to fetch banned email' });
//   }
// }

// // Create a new banned email
// export async function createBannedEmail(
//   req: Request,
//   res: Response,
//   prisma: PrismaClient
// ) {
//   try {
//     const user = res.locals.userInfo;
//     const { email, reason } = res.locals.validatedBody;
//     const organizationId = res.locals.userInfo.organizationId;
//     const resourceType = res.locals.resourceType;

//     // Check if the email already exists
//     const existingBannedEmail = await prisma.bannedEmail.findUnique({
//       where: { email },
//     });

//     if (existingBannedEmail) {
//       return res.status(409).json({ error: 'Email already banned' });
//     }

//     // Create a new banned email
//     const bannedEmail = await createResourceService(
//       prisma,
//       resourceType,
//       organizationId,
//       async (tx) =>
//         await tx.bannedEmail.create({
//           data: { email, reason, organizationId: organizationId },
//         })
//     );

//     // Log the event
//     res.locals.logEvents = [
//       buildLogEvent({
//         userId: user.id,
//         actorType: 'USER',
//         action: 'BAN_USER_EMAIL',
//         targetId: null,
//         targetType: 'USER',
//         organizationId: organizationId,
//         metadata: {
//           createdAt: `${bannedEmail.createdAt}`,
//           reason: `${bannedEmail.reason}`,
//           email: `${bannedEmail.email}`,
//         },
//       }),
//     ];

//     return res.status(201).json({
//       message: 'Banned email created successfully',
//       data: bannedEmail,
//     });
//   } catch (error) {
//     console.error('Error creating banned email: ', error);
//     return res.status(500).json({ error: 'Failed to create banned email' });
//   }
// }

// // Function deletes the record from the banned email list, effectively un-banning the email
// export async function deleteBannedEmail(
//   req: Request,
//   res: Response,
//   prisma: PrismaClient
// ) {
//   try {
//     const user = res.locals.userInfo;
//     const organizationId = res.locals.userInfo.organizationId;
//     const emailId = res.locals.validatedParam;

//     const oldEmail = await prisma.bannedEmail.findUnique({
//       where: { id: emailId, organizationId: organizationId },
//     });

//     if (!oldEmail) {
//       return res.status(404).json({ error: 'Banned email not found' });
//     }

//     await deleteResourceService(
//       prisma,
//       organizationId,
//       async (tx) =>
//         await tx.bannedEmail.delete({
//           where: { id: emailId, organizationId: organizationId },
//         })
//     );

//     // Log the event
//     res.locals.logEvents = [
//       buildLogEvent({
//         userId: user.id,
//         actorType: 'USER',
//         action: 'DELETE_BANNED_EMAIL',
//         targetId: null,
//         targetType: 'USER',
//         organizationId: organizationId,
//         metadata: {
//           message: 'Previous ban information',
//           reason: `${oldEmail.reason}`,
//           email: `${oldEmail.email}`,
//           createdAt: `${oldEmail.createdAt}`,
//         },
//       }),
//     ];
//     res
//       .status(200)
//       .json({ message: 'Banned email deleted successfully', data: oldEmail });
//     return;
//   } catch (error) {
//     console.error('Error deleting banned email: ', error);
//     return res.status(500).json({ error: 'Failed to delete banned email' });
//   }
// }
