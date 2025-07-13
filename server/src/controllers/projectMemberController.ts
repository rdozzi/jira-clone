import { Request, Response } from 'express';
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
    const projectIdParsed = parseInt(projectId, 10);

    const projectMemberRecords = await prisma.projectMember.findMany({
      where: { projectId: projectIdParsed },
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
    return;
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Could not get users in the project', error });
    console.error('Could not get users in the specified project', error);
    return;
  }
}

// Add project member
export async function addProjectMember(
  req: Request,
  res: Response,
  prisma: PrismaClient
) {
  try {
    // From storeUserAndProjectInfo
    const userInfo = res.locals.userInfo;
    const { projectId } = req.params;
    const newProjectMemberData: { userId: number; projectRole: ProjectRole } =
      req.body;

    if (!projectId) {
      res.status(401).json({ message: 'No project found' });
      return;
    }

    const projectIdParsed = parseInt(projectId, 10);

    const projectExists = await prisma.project.findUnique({
      where: { id: projectIdParsed },
      select: { id: true },
    });
    if (!projectExists) {
      res.status(404).json({ message: 'Project not found' });
      return;
    }

    const newProjectMember = await prisma.projectMember.create({
      data: { ...newProjectMemberData, projectId: projectIdParsed },
    });

    const newUserData = await prisma.user.findUnique({
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
      userId: userInfo?.id,
      actorType: 'USER',
      action: 'ADD_PROJECT_MEMBER',
      targetId: projectIdParsed,
      targetType: 'PROJECT_MEMBER',
      metadata: {
        firstName_lastName: `${newUserData?.firstName}_${newUserData?.lastName}`,
        email: newUserData?.email,
        projectRole: newProjectMember.projectRole,
      },
    });

    res
      .status(201)
      .json({ message: 'Project member added successfully', newProjectMember });
    return;
  } catch (error) {
    console.error('Error adding project member:', error);
    res.status(500).json({ message: 'Failed to add project member' });
    return;
  }
}

// Remove project member
export async function removeProjectMember(
  req: Request,
  res: Response,
  prisma: PrismaClient
) {
  try {
    // From storeUserAndProjectInfo
    const userInfo = res.locals.userInfo;
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

    const removedUserData = await prisma.user.findUnique({
      where: { id: userIdParse },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
      },
    });

    res.locals.logEvent = buildLogEvent({
      userId: userInfo?.id,
      actorType: 'USER',
      action: 'REMOVE_PROJECT_MEMBER',
      targetId: removedUserData?.id,
      targetType: 'PROJECT_MEMBER',
      metadata: {
        projectRole: projectMember.projectRole,
        firstName_lastName: `${removedUserData?.firstName}_${removedUserData?.lastName}`,
        email: removedUserData?.email,
      },
    });

    res.status(200).json({
      message: 'Project member removed successfully',
      removedUserData,
    });
    return;
  } catch (error) {
    console.error('Error removing project member:', error);
    res.status(500).json({ message: 'Failed to remove project member' });
    return;
  }
}

// Update project member role
export async function updateProjectMemberRole(
  req: Request,
  res: Response,
  prisma: PrismaClient
) {
  try {
    // From storeUserAndProjectInfo
    const userInfo = res.locals.userInfo;
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

    res.locals.logEvent = buildLogEvent({
      userId: userInfo.id,
      actorType: 'USER',
      action: 'UPDATE_PROJECT_MEMBER_ROLE',
      targetId: projectIdParse,
      targetType: 'PROJECT_MEMBER',
      metadata: {
        changes: generateDiff(
          { projectRole: projectMember.projectRole },
          { projectRole: updatedProjectMember.projectRole }
        ),
      },
    });

    res.status(200).json({
      message: "Project member's role updated successfully",
      updatedProjectMember,
    });
    return;
  } catch (error) {
    console.error('Error updating project member role:', error);
    res.status(500).json({ message: 'Failed to update project member role' });
    return;
  }
}
