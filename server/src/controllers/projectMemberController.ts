import { NextFunction, Request, Response } from 'express';
import { CustomRequest } from '../types/CustomRequest';
import { PrismaClient, ProjectRole } from '@prisma/client';
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

// Add project member
export async function addProjectMember(
  req: CustomRequest,
  res: Response,
  prisma: PrismaClient
) {
  try {
    const { projectId } = req.params;

    if (!projectId) {
      res.status(401).json({ message: 'No project found' });
      return;
    }

    const projectIdParse = parseInt(projectId, 10);

    const projectExists = await prisma.project.findUnique({
      where: { id: projectIdParse },
      select: { id: true },
    });
    if (!projectExists) {
      res.status(404).json({ message: 'Project not found' });
      return;
    }

    const newProjectMemberData: { userId: number; projectRole: ProjectRole } =
      req.body;

    const newProjectMember = await prisma.projectMember.create({
      data: { ...newProjectMemberData, projectId: projectIdParse },
    });

    const userData = await prisma.user.findUnique({
      where: { id: newProjectMember.userId },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        avatarSource: true,
      },
    });

    res.locals.logEvent = buildLogEvent({
      userId: newProjectMember.userId,
      actorType: 'USER',
      action: 'ADD_PROJECT_MEMBER',
      targetId: newProjectMember.projectId,
      targetType: 'PROJECT_MEMBER',
      metadata: {
        userId: userData?.id,
        firstName: userData?.firstName,
        lastName: userData?.lastName,
        email: userData?.email,
        avatarURL: userData?.avatarSource,
        projectRole: newProjectMember.projectRole,
      },
      ticketId: null,
      boardId: null,
      projectId: newProjectMember.projectId,
    });

    res.status(201).json(newProjectMember);
  } catch (error) {
    console.error('Error adding project member:', error);
    res.status(500).json({ message: 'Failed to add project member' });
  }
}
