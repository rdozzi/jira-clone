import { Request, Response } from 'express';
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
      userId: res.locals.userId,
      actorType: 'USER',
      action: 'ADD_PROJECT_MEMBER',
      targetId: newProjectMember.userId,
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

// Remove project member
export async function removeProjectMember(
  req: CustomRequest,
  res: Response,
  prisma: PrismaClient
) {
  try {
    const { projectId, userId } = req.params;

    if (!projectId || !userId) {
      res.status(400).json({ message: 'Project ID and User ID are required' });
      return;
    }

    const projectIdParse = parseInt(projectId, 10);
    const userIdParse = parseInt(userId, 10);

    if (isNaN(projectIdParse) || isNaN(userIdParse)) {
      res.status(400).json({ message: 'Invalid projectId or userId' });
      return;
    }

    const projectMember = await prisma.projectMember.findUnique({
      where: {
        userId_projectId: { projectId: projectIdParse, userId: userIdParse },
      },
    });

    if (!projectMember) {
      res.status(404).json({ message: 'Project member not found' });
      return;
    }

    await prisma.projectMember.delete({
      where: { id: projectMember.id },
    });

    const userData = await prisma.user.findUnique({
      where: { id: userIdParse },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
      },
    });

    res.locals.logEvent = buildLogEvent({
      userId: res.locals.userId,
      actorType: 'USER',
      action: 'REMOVE_PROJECT_MEMBER',
      targetId: userIdParse,
      targetType: 'PROJECT_MEMBER',
      metadata: {
        userId: userIdParse,
        projectRole: projectMember.projectRole,
        firstName: userData?.firstName,
        lastName: userData?.lastName,
        email: userData?.email,
      },
      ticketId: null,
      boardId: null,
      projectId: projectIdParse,
    });

    res.status(200).json({ message: 'Project member removed successfully' });
  } catch (error) {
    console.error('Error removing project member:', error);
    res.status(500).json({ message: 'Failed to remove project member' });
  }
}

// Update project member role
export async function updateProjectMemberRole(
  req: CustomRequest,
  res: Response,
  prisma: PrismaClient
) {
  try {
    const { projectId, userId } = req.params;
    const { projectRole } = req.body;

    if (!projectId || !userId || !projectRole) {
      res
        .status(400)
        .json({ message: 'Project ID, User ID, and role are required' });
      return;
    }

    const projectIdParse = parseInt(projectId, 10);
    const userIdParse = parseInt(userId, 10);

    if (isNaN(projectIdParse) || isNaN(userIdParse)) {
      res.status(400).json({ message: 'Invalid projectId or userId' });
      return;
    }

    const projectMember = await prisma.projectMember.findUnique({
      where: {
        userId_projectId: { projectId: projectIdParse, userId: userIdParse },
      },
    });

    if (!projectMember) {
      res.status(404).json({ message: 'Project member not found' });
      return;
    }

    const updatedProjectMember = await prisma.projectMember.update({
      where: { id: projectMember.id },
      data: { projectRole },
    });

    const userData = await prisma.user.findUnique({
      where: { id: userIdParse },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
      },
    });

    res.locals.logEvent = buildLogEvent({
      userId: res.locals.userId,
      actorType: 'USER',
      action: 'UPDATE_PROJECT_MEMBER_ROLE',
      targetId: userIdParse,
      targetType: 'PROJECT_MEMBER',
      metadata: {
        userId: userIdParse,
        changes: generateDiff(
          { projectRole: projectMember.projectRole },
          { projectRole: updatedProjectMember.projectRole }
        ),
        firstName: userData?.firstName,
        lastName: userData?.lastName,
        email: userData?.email,
      },
      ticketId: null,
      boardId: null,
      projectId: projectIdParse,
    });

    res.status(200).json(updatedProjectMember);
  } catch (error) {
    console.error('Error updating project member role:', error);
    res.status(500).json({ message: 'Failed to update project member role' });
  }
}
