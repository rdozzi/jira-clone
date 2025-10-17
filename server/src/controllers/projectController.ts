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
import { logBus } from '../lib/logBus';

export async function getAllProjects(
  req: Request,
  res: Response,
  prisma: PrismaClient
) {
  try {
    const organizationId = res.locals.userInfo.organizationId;
    const projects = await prisma.project.findMany({
      where: { organizationId: organizationId },
      include: { owner: { select: { firstName: true, lastName: true } } },
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
    const userProjects = res.locals.userProjects;
    const organizationId = res.locals.userInfo.organizationId;

    const projectIds: number[] = userProjects.map(
      (p: { projectId: number; projectRole: string }) => p.projectId
    );

    const projects = await prisma.project.findMany({
      where: { organizationId: organizationId, id: { in: projectIds } },
      include: { owner: { select: { firstName: true, lastName: true } } },
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
    let projectMember;

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

    try {
      const newProjectBoard = await prisma.board.create({
        data: {
          name: `${project.name} default board`,
          description: `${project.name} default board`,
          projectId: project.id,
          organizationId: organizationId,
        },
      });

      projectMember = await prisma.projectMember.create({
        data: {
          userId: user.id,
          projectId: project.id,
          projectRole: ProjectRole.ADMIN,
          organizationId: organizationId,
        },
      });

      const logEvents = [
        buildLogEvent({
          userId: user.id,
          actorType: 'USER',
          action: 'CREATE_BOARD',
          targetId: newProjectBoard.id,
          targetType: 'BOARD',
          organizationId: organizationId,
          metadata: {
            name: `${newProjectBoard.name}`,
            description: `${newProjectBoard.description}`,
          },
        }),
      ];

      logBus.emit('activityLog', logEvents);
    } catch (setupError) {
      console.error(
        `Failed to create board or add project member: ${setupError}`
      );
    }

    const logEvents = [
      buildLogEvent({
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
          ...(projectMember
            ? { projectRole: projectMember.projectRole }
            : { projectRole: null }),
        },
      }),
    ];

    logBus.emit('activityLog', logEvents);

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

    const logEvents = [
      buildLogEvent({
        userId: user.id,
        actorType: 'USER',
        action: 'UPDATE_PROJECT',
        targetId: projectId,
        targetType: 'PROJECT',
        organizationId: organizationId,
        metadata: {
          change,
        },
      }),
    ];

    logBus.emit('activityLog', logEvents);

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

    const deleteLog = [
      buildLogEvent({
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
      }),
    ];

    logBus.emit('activityLog', deleteLog);

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
