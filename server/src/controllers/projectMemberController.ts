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
    const projectId = res.locals.validatedParam;
    const organizationId = res.locals.userInfo.organizationId;

    const projectMemberRecords = await prisma.projectMember.findMany({
      where: { projectId: projectId, organizationId: organizationId },
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

    res
      .status(200)
      .json({
        message: 'Project members fetched successfully',
        data: projectUserPayload,
      });
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
    const organizationId = res.locals.userInfo.organizationId;
    const projectId = res.locals.validatedParam;
    const newProjectMemberData: { userId: number; projectRole: ProjectRole } =
      req.body;

    if (!projectId) {
      res.status(401).json({ message: 'No project found' });
      return;
    }

    const projectExists = await prisma.project.findUnique({
      where: { id: projectId, organizationId: organizationId },
      select: { id: true },
    });
    if (!projectExists) {
      res.status(404).json({ message: 'Project not found' });
      return;
    }

    const newProjectMember = await prisma.projectMember.create({
      data: {
        ...newProjectMemberData,
        projectId: projectId,
        organizationId: organizationId,
      },
    });

    const newUserData = await prisma.user.findUnique({
      where: { id: newProjectMember.userId, organizationId: organizationId },
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
      targetId: projectId,
      targetType: 'PROJECT_MEMBER',
      organizationId: organizationId,
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
    const { projectId, userId } = res.locals.validatedParams;
    const organizationId = res.locals.userInfo.organizationId;

    const projectMember = await prisma.projectMember.findUnique({
      where: {
        userId_projectId: { projectId: projectId, userId: userId },
        organizationId: organizationId,
      },
    });

    if (!projectMember) {
      res.status(404).json({ message: 'Project member not found' });
      return;
    }

    await prisma.projectMember.delete({
      where: { id: projectMember.id, organizationId: organizationId },
    });

    const removedUserData = await prisma.user.findUnique({
      where: { id: userId },
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
      organizationId: organizationId,
      metadata: {
        projectRole: projectMember.projectRole,
        firstName_lastName: `${removedUserData?.firstName}_${removedUserData?.lastName}`,
        email: removedUserData?.email,
        projectId: projectId,
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
    const { projectId, userId } = res.locals.validatedParams;
    const { projectRole } = res.locals.validatedBody;
    const organizationId = res.locals.userInfo.organizationId;

    const projectMember = await prisma.projectMember.findUnique({
      where: {
        userId_projectId: { projectId: projectId, userId: userId },
        organizationId: organizationId,
      },
    });

    if (!projectMember) {
      res.status(404).json({ message: 'Project member not found' });
      return;
    }

    const updatedProjectMember = await prisma.projectMember.update({
      where: { id: projectMember.id, organizationId: organizationId },
      data: { projectRole },
    });

    res.locals.logEvent = buildLogEvent({
      userId: userInfo.id,
      actorType: 'USER',
      action: 'UPDATE_PROJECT_MEMBER_ROLE',
      targetId: projectId,
      targetType: 'PROJECT_MEMBER',
      organizationId: organizationId,
      metadata: {
        changes: generateDiff(
          { projectRole: projectMember.projectRole },
          { projectRole: updatedProjectMember.projectRole }
        ),
      },
    });

    res.status(200).json({
      message: 'Project member role updated successfully',
      updatedProjectMember,
    });
    return;
  } catch (error) {
    console.error('Error updating project member role:', error);
    res.status(500).json({ message: 'Failed to update project member role' });
    return;
  }
}
