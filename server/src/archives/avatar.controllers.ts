// The fileMetadata reference isn't compatible for the updated application of the storageDispatcher function. User's are not currently assigned downloadable avatars. Function deprecated for MVP. Avatar features may be added after deployment.

// Update SuperUser avatar
// export async function updateSuperUserAvatar(
//   req: Request,
//   res: Response,
//   prisma: PrismaClient
// ) {
// try {
//   const userId = res.locals.validatedParam;
//   const user = await prisma.user.findUnique({
//     where: { id: userId, globalRole: GlobalRole.SUPERUSER },
//   });
//   if (user?.isDeleted || user?.deletedAt || user?.isBanned) {
//     return res
//       .status(400)
//       .json({ error: 'Deleted or banned user avatar cannot be changed' });
//   }
//   if (!req.file) {
//     return res.status(400).json({ error: 'No file uploaded' });
//   }
//   const storageType = getStorageType();

// const fileMetadata = await storageDispatcher(req.file, storageType);
// const fileSource =
//   storageType === 'CLOUD' ? fileMetadata.fileUrl : fileMetadata.savedPath;
// const updatedUser = await prisma.user.update({
//   where: { id: userId, globalRole: GlobalRole.SUPERUSER },
//   data: {
//     avatarSource: fileSource,
//   },
// });
//   res.status(200).json({
//     data: {
//       id: `${updatedUser.id}`,
//       avatarSource: updatedUser.avatarSource,
//       userName: `${updatedUser.firstName} ${updatedUser.lastName}`,
//       organizationId: `${updatedUser.organizationId}`,
//     },
//     message: 'User avatar updated successfully',
//   });
//   return;
// } catch (error) {
//   console.error('Error updating user avatar: ', error);
//   res.status(500).json({ error: 'Failed to update user avatar' });
//   return;
// }
// }

// Function deprecated for MVP. Avatar features may be added after deployment.

// Update user avatar
// export async function updateUserAvatar(
//   req: Request,
//   res: Response,
//   prisma: PrismaClient
// ) {
//   try {
//     const userId = res.locals.validatedParam;
//     const organizationId = res.locals.userInfo.organizationId;

//     if (!req.file) {
//       return res.status(400).json({ error: 'No file uploaded' });
//     }

//     const storageType = getStorageType();
//     const fileMetadata = await storageDispatcher(req.file, storageType);

//     const fileSource =
//       storageType === 'CLOUD' ? fileMetadata.cloudUrl : fileMetadata.savedPath;

//     const updatedUser = await prisma.user.update({
//       where: { id: userId, organizationId: organizationId },
//       data: {
//         avatarSource: fileSource,
//       },
//     });

//     res.status(200).json({
//       data: {
//         id: `${updatedUser.id}`,
//         avatarSource: updatedUser.avatarSource,
//         userName: `${updatedUser.firstName} ${updatedUser.lastName}`,
//         organizationId: `${updatedUser.organizationId}`,
//       },
//       message: 'User avatar updated successfully',
//     });
//     return;
//   } catch (error) {
//     console.error('Error updating user avatar: ', error);
//     res.status(500).json({ error: 'Failed to update user avatar' });
//     return;
//   }
// }

// Update user avatar
//

// router.patch(
//   '/users/:userId/avatar',
//   authorizeSelfOrAdminWithRoleCheck(),
//   uploadSingleMiddleware,
//   validateParams,
//   async (req: Request, res: Response) => {
//     await updateUserAvatar(req, res, prisma);
//   }
// );
