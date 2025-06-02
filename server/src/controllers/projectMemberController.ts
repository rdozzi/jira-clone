import { NextFunction, Request, Response } from 'express';
import { CustomRequest } from '../types/CustomRequest';
import { PrismaClient } from '@prisma/client';
import { buildLogEvent } from '../services/buildLogEvent';
import { generateDiff } from '../services/generateDiff';

// View Project Members
export async function viewProjectMembers(
  req: Request,
  res: Response,
  prisma: PrismaClient
) {
  try {
    const { projectId } = req.params;
    const projectIdParse = parseInt(projectId, 10);

    const projectMemberRecords = await prisma.projectMember.findMany({
      where: { projectId: projectIdParse },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            avatarSource: true,
          },
        },
      },
    });

    const projectUserPayload = projectMemberRecords.map((member) => ({
      userId: member.userId,
      projectRole: member.projectRole,
      firstName: member.user.firstName,
      lastName: member.user.lastName,
      email: member.user.email,
      avatarURL: member.user.avatarSource,
    }));

    res.status(200).json(projectUserPayload);
  } catch (error) {
    console.error(error);
  }
}
