import { Prisma } from '@prisma/client';
import prisma from '../../lib/prisma';

// Defines the cascade of updates when a user is soft-deleted.
export async function deleteUserCascade(
  userId: number,
  organizationId: number
) {
  await prisma.$transaction(async (tx) => {
    await nullifyProjectOwner(tx, userId, organizationId);
    await nullifyTicketAssignee(tx, userId, organizationId);
    await nullifyTicketReporter(tx, userId, organizationId);
    await nullifyCommentAuthor(tx, userId, organizationId);
    await nullifyAttachmentUploader(tx, userId, organizationId);
    // projectMember table is retained
  });
}

async function nullifyProjectOwner(
  tx: Prisma.TransactionClient,
  userId: number,
  organizationId: number
) {
  return tx.project.updateMany({
    where: { ownerId: userId, organizationId: organizationId },
    data: { ownerId: null },
  });
}

async function nullifyTicketAssignee(
  tx: Prisma.TransactionClient,
  userId: number,
  organizationId: number
) {
  return tx.ticket.updateMany({
    where: { assigneeId: userId, organizationId: organizationId },
    data: { assigneeId: null },
  });
}

async function nullifyTicketReporter(
  tx: Prisma.TransactionClient,
  userId: number,
  organizationId: number
) {
  return tx.ticket.updateMany({
    where: { reporterId: userId, organizationId: organizationId },
    data: { reporterId: null },
  });
}

async function nullifyCommentAuthor(
  tx: Prisma.TransactionClient,
  userId: number,
  organizationId: number
) {
  return tx.comment.updateMany({
    where: { authorId: userId, organizationId: organizationId },
    data: { authorId: null },
  });
}

async function nullifyAttachmentUploader(
  tx: Prisma.TransactionClient,
  userId: number,
  organizationId: number
) {
  return tx.attachment.updateMany({
    where: { uploadedBy: userId, organizationId: organizationId },
    data: { uploadedBy: null },
  });
}
