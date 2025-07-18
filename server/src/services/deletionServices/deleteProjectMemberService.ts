import { Response } from 'express';
import { Prisma } from '@prisma/client';

export function deleteProjectMemberService(
  res: Response,
  tx: Prisma.TransactionClient,
  entityId: number // project id
) {
  return tx.projectMember.deleteMany({ where: { projectId: entityId } });
}
