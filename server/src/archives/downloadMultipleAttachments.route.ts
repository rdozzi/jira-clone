// Will supersede single download route and mechanism

// Download multiple attachments by EntityId
// Body: Array of Ids (attachmentIds), entityId, entityType
// router.post(
//   '/attachments/download',
//   authorizeOrganizationRole(OrganizationRole.USER),
//   validateAndSetAttachmentDeleteAndDownloadParams,
//   resolveProjectIdForMultipleDeletionAndDownload(prisma),
//   checkProjectMembership({ allowOrganizationSuperAdmin: true }),
//   checkProjectRole(ProjectRole.USER, { allowOrganizationSuperAdmin: true }),
//   async (req: Request, res: Response, next: NextFunction): Promise<void> => {
//     await downloadMultipleAttachments(req, res, next, prisma);
//   }
// );
