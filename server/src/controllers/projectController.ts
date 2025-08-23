import { Request, Response } from 'express';
import {
  AttachmentEntityType,
  PrismaClient,
  ProjectRole,
} from '@prisma/client';
import { buildLogEvent } from '../services/buildLogEvent';
import { generateDiff } from '../services/generateDiff';
import { deleteProjectDependencies } from '../services/deletionServices/deleteProjectDependencies';
import { createResourceService } from '../services/organizationUsageServices/createResourceService';
import { deleteResourceService } from '../services/organizationUsageServices/deleteResourceService';

export async function getAllProjects(
  req: Request,
  res: Response,
  prisma: PrismaClient
) {
  try {
    const organizationId = res.locals.userInfo.organizationId;
    const projects = await prisma.project.findMany({
      where: { organizationId: organizationId },
    });
    res
      .status(200)
      .json({ message: 'Projects fetched succesfully', data: projects });
    return;
  } catch (error) {
    console.error('Error fetching projects: ', error);
    res.status(500).json({ error: 'Failed to fetch projects' });
    return;
  }
}

export async function getProjectsByUserId(
  req: Request,
  res: Response,
  prisma: PrismaClient
) {
  try {
    const userId = res.locals.userInfo.id;
    const organizationId = res.locals.userInfo.organizationId;

    const projects = await prisma.projectMember.findMany({
      where: { userId: userId, organizationId: organizationId },
      select: { project: true, projectRole: true },
    });

    res
      .status(200)
      .json({ message: 'Projects fetched successfully', data: projects });
  } catch (error) {
    console.error('Error fetching projects: ', error);
    res.status(500).json({ error: 'Failed to fetch projects' });
    return;
  }
}

// Deprecated.
// export async function getProjectById(
//   req: Request,
//   res: Response,
//   prisma: PrismaClient
// ) {
//   const { projectId } = req.params;
//   const projectIdParsed = parseInt(projectId, 10);

//   try {
//     const projects = await prisma.project.findUnique({
//       where: { id: projectIdParsed },
//     });
//     res.status(200).json(projects);
//     return;
//   } catch (error) {
//     console.error('Error fetching projects: ', error);
//     res.status(500).json({ error: 'Failed to fetch projects' });
//     return;
//   }
// }

export async function createProject(
  req: Request,
  res: Response,
  prisma: PrismaClient
) {
  try {
    const user = res.locals.userInfo;
    const organizationId = res.locals.userInfo.organizationId;
    const resourceType = res.locals.resourceType;

    const projectData = res.locals.validatedBody;
    const data = {
      name: projectData.name,
      description: projectData.description,
      ownerId: user.id,
      organizationId: organizationId,
    };

    const project = await createResourceService(
      prisma,
      resourceType,
      organizationId,
      async (tx) =>
        await tx.project.create({
          data,
        })
    );

    const projectMember = await prisma.projectMember.create({
      data: {
        userId: user.id,
        projectId: project.id,
        projectRole: ProjectRole.ADMIN,
        organizationId: organizationId,
      },
    });

    res.locals.logEvent = buildLogEvent({
      userId: user.id,
      actorType: 'USER',
      action: 'CREATE_PROJECT',
      targetId: project.id,
      targetType: 'PROJECT',
      organizationId: organizationId,
      metadata: {
        projectName: project.name,
        projectDescription: project.description,
        projectOwnerId: project.ownerId,
        projectRole: projectMember.projectRole,
      },
    });

    res.status(201).json({
      message: `Project created successfully`,
      data: project,
    });
    return;
  } catch (error) {
    console.error('Error creating project: ', error);
    res.status(500).json({ error: 'Failed to create project' });
    return;
  }
}

export async function updateProject(
  req: Request,
  res: Response,
  prisma: PrismaClient
) {
  try {
    const user = res.locals.userInfo;
    const projectId = res.locals.validatedParam;
    const projectData = res.locals.validatedBody;
    const organizationId = res.locals.userInfo.organizationId;

    const oldProject = await prisma.project.findUnique({
      where: { id: projectId, organizationId: organizationId },
    });

    const newProject = await prisma.project.update({
      where: { id: projectId, organizationId: organizationId },
      data: { ...projectData },
    });

    const change =
      oldProject && newProject ? generateDiff(oldProject, newProject) : {};

    res.locals.logEvent = buildLogEvent({
      userId: user.id,
      actorType: 'USER',
      action: 'UPDATE_PROJECT',
      targetId: projectId,
      targetType: 'PROJECT',
      organizationId: organizationId,
      metadata: {
        change,
      },
    });

    res.status(200).json({
      message: `Project updated successfully`,
      data: newProject,
    });
    return;
  } catch (error) {
    console.error('Error creating project: ', error);
    res.status(500).json({ error: 'Failed to create project' });
    return;
  }
}

export async function deleteProject(
  req: Request,
  res: Response,
  prisma: PrismaClient
) {
  try {
    const userId = res.locals.userInfo.id;
    const projectId = res.locals.validatedParam;
    const organizationId = res.locals.userInfo.organizationId;

    const oldProject = await prisma.project.findUnique({
      where: { id: projectId, organizationId: organizationId },
    });

    if (!oldProject) {
      res.status(400).json({ message: 'No project found.' });
      return;
    }

    await deleteResourceService(prisma, organizationId, async (tx) => {
      await deleteProjectDependencies(
        res,
        tx,
        AttachmentEntityType.PROJECT,
        projectId,
        userId,
        organizationId
      );
      await tx.project.delete({
        where: { id: projectId, organizationId: organizationId },
      });
    });

    res.locals.logEvent = buildLogEvent({
      userId: userId,
      actorType: 'USER',
      action: 'DELETE_PROJECT',
      targetId: projectId,
      targetType: 'PROJECT',
      organizationId: organizationId,
      metadata: {
        name: oldProject.name,
        description: oldProject?.description,
        owner: oldProject.ownerId,
      },
    });

    res.status(200).json({
      message: `Project deleted successfully`,
      data: oldProject,
    });
    return;
  } catch (error) {
    console.error('Error fetching project: ', error);
    res.status(500).json({ error: 'Failed to fetch project' });
    return;
  }
}
