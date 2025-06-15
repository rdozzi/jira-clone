import { Prisma } from '@prisma/client';
import prisma from '../../lib/prisma';

// Defines the cascade of updates when a user is soft-deleted.
export async function deleteUserCascade(userId: number) {
  await prisma.$transaction(async (tx) => {
    await nullifyProjectOwner(tx, userId);
    await nullifyTicketAssignee(tx, userId);
    await nullifyTicketReporter(tx, userId);
    await nullifyCommentAuthor(tx, userId);
    await nullifyAttachmentUploader(tx, userId);
    // projectMember table is retained
  });
}

async function nullifyProjectOwner(
  tx: Prisma.TransactionClient,
  userId: number
) {
  return tx.project.updateMany({
    where: { ownerId: userId },
    data: { ownerId: null },
  });
}

async function nullifyTicketAssignee(
  tx: Prisma.TransactionClient,
  userId: number
) {
  return tx.ticket.updateMany({
    where: { assigneeId: userId },
    data: { assigneeId: null },
  });
}

async function nullifyTicketReporter(
  tx: Prisma.TransactionClient,
  userId: number
) {
  return tx.ticket.updateMany({
    where: { reporterId: userId },
    data: { reporterId: null },
  });
}

async function nullifyCommentAuthor(
  tx: Prisma.TransactionClient,
  userId: number
) {
  return tx.comment.updateMany({
    where: { authorId: userId },
    data: { authorId: null },
  });
}

async function nullifyAttachmentUploader(
  tx: Prisma.TransactionClient,
  userId: number
) {
  return tx.attachment.updateMany({
    where: { uploadedBy: userId },
    data: { uploadedBy: null },
  });
}
