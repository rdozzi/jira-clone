import { prismaTest } from '../../lib/prismaTestClient';

export async function resetTestDatabase() {
  prismaTest.$transaction(async (tx) => {
    await tx.projectMember.deleteMany();
    await tx.activityLog.deleteMany();
    await tx.ticketLabel.deleteMany();
    await tx.label.deleteMany();
    await tx.attachment.deleteMany();
    await tx.bannedEmail.deleteMany();
    await tx.user.deleteMany();
    await tx.comment.deleteMany();
    await tx.ticket.deleteMany();
    await tx.board.deleteMany();
    await tx.project.deleteMany();
  });
}
