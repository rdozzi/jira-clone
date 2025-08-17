import { PrismaClient, Prisma } from '@prisma/client';
import { namespace } from '../../lib/namespace';

export async function deleteResourceService<T>(
  prisma: PrismaClient,
  organizationId: number,
  doDelete: (tx: Prisma.TransactionClient) => Promise<T | null>
) {
  try {
    await prisma.$transaction(async (tx) => {
      // 1) Lock Resource
      const NS: number = namespace['deleteResource'];
      await tx.$executeRaw`SELECT pg_advisory_xact_lock(${NS}::int,${organizationId}::int)`;

      // 2) Delete action
      await doDelete(tx);

      // 3) Re-compute totals
      const [
        projectCount,
        boardCount,
        ticketCount,
        commentCount,
        userCount,
        labelCount,
        totalAttachmentSize,
      ] = [
        await tx.project.count({ where: { organizationId } }),
        await tx.board.count({ where: { organizationId } }),
        await tx.ticket.count({ where: { organizationId } }),
        await tx.comment.count({ where: { organizationId } }),
        await tx.user.count({
          where: { organizationId, deletedAt: null, isDeleted: false },
        }),
        await tx.label.count({ where: { organizationId } }),
        await tx.attachment
          .aggregate({
            where: { organizationId },
            _sum: { fileSize: true },
          })
          .then((result) => result._sum.fileSize),
      ];

      // 4) Update totals
      await tx.organizationProjectUsage.update({
        where: { organizationId: organizationId },
        data: { totalProjects: projectCount },
      });

      await tx.organizationBoardUsage.update({
        where: { organizationId: organizationId },
        data: { totalBoards: boardCount },
      });

      await tx.organizationTicketUsage.update({
        where: { organizationId: organizationId },
        data: { totalTickets: ticketCount },
      });

      await tx.organizationCommentUsage.update({
        where: { organizationId: organizationId },
        data: { totalComments: commentCount },
      });

      await tx.organizationUserUsage.update({
        where: { organizationId: organizationId },
        data: { totalUsers: userCount },
      });

      await tx.organizationLabelUsage.update({
        where: { organizationId: organizationId },
        data: { totalLabels: labelCount },
      });

      if (totalAttachmentSize) {
        await tx.organizationFileStorageUsage.update({
          where: { organizationId: organizationId },
          data: { totalFileStorage: totalAttachmentSize },
        });
      }
    });

    return null;
  } catch (error) {
    throw new Error(`Error while deleting and updating count table: ${error}`);
  }
}
