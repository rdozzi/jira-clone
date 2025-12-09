// Upload multiple attachments
// Body/Form-Data (Multer Required): {files, entityType, entityId}
// router.post(
//   '/attachments/many',
//   authorizeOrganizationRole(OrganizationRole.USER),
//   uploadMultipleMiddleware,
//   resolveProjectIdForCreateAttachment(prisma),
//   checkProjectMembership(),
//   checkProjectRole(ProjectRole.USER),
//   loadEntityIdAndEntityTypeForUpload,
//   checkTicketOrCommentOwnershipForAttachments,
//   checkBoardAndProjectAccess,
//   validateBody(uploadAttachmentSchema),
//   checkMaxUsageTotals(prisma),
//   async (req: Request, res: Response, next: NextFunction): Promise<void> => {
//     await handleMultipleUpload(req as CustomRequest, res, next, prisma);
//   }
// );
