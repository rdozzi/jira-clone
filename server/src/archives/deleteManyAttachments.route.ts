// Delete many attachments
// Body: Array of Id values (attachmentIds), entityId, entityType
// router.delete(
//   '/attachments',
//   authorizeOrganizationRole(OrganizationRole.USER),
//   validateAndSetAttachmentDeleteAndDownloadParams,
//   resolveProjectIdForMultipleDeletionAndDownload(prisma),
//   checkProjectMembership({ allowOrganizationSuperAdmin: true }),
//   checkProjectRole(ProjectRole.USER, { allowOrganizationSuperAdmin: true }),
//   checkTicketOrCommentOwnershipForAttachments,
//   checkBoardAndProjectAccess,
//   async (req: Request, res: Response, next: NextFunction): Promise<void> => {
//     await deleteManyAttachments(req, res, next, prisma);
//   }
// );
