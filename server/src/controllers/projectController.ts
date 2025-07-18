import { Request, Response } from 'express';
import {
  AttachmentEntityType,
  PrismaClient,
  ProjectRole,
} from '@prisma/client';
import { buildLogEvent } from '../services/buildLogEvent';
import { generateDiff } from '../services/generateDiff';
import { deleteProjectDependencies } from '../services/deletionServices/deleteProjectDependencies';

export async function getAllProjects(
  req: Request,
  res: Response,
  prisma: PrismaClient
) {
  try {
    const projects = await prisma.project.findMany();
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

    const projectData = req.body;
    const data = {
      name: projectData.name,
      description: projectData.description,
      ownerId: user.id,
    };
    const project = await prisma.project.create({
      data,
    });

    const projectMember = await prisma.projectMember.create({
      data: {
        userId: user.id,
        projectId: project.id,
        projectRole: ProjectRole.ADMIN,
      },
    });

    res.locals.logEvent = buildLogEvent({
      userId: user.id,
      actorType: 'USER',
      action: 'CREATE_PROJECT',
      targetId: project.id,
      targetType: 'PROJECT',
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

    const { projectId } = req.params;
    const projectIdParsed = parseInt(projectId, 10);

    if (isNaN(projectIdParsed)) {
      res.status(400).json({ message: 'Invalid project ID' });
      return;
    }

    const projectData = req.body;

    const oldProject = await prisma.project.findUnique({
      where: { id: projectIdParsed },
    });

    const newProject = await prisma.project.update({
      where: { id: projectIdParsed },
      data: { ...projectData },
    });

    const change =
      oldProject && newProject ? generateDiff(oldProject, newProject) : {};

    res.locals.logEvent = buildLogEvent({
      userId: user.id,
      actorType: 'USER',
      action: 'UPDATE_PROJECT',
      targetId: projectIdParsed,
      targetType: 'PROJECT',
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

    const { projectId } = req.params;
    const projectIdParsed = parseInt(projectId, 10);

    if (isNaN(projectIdParsed)) {
      return res.status(400).json({ message: 'Invalid project ID' });
    }

    const oldProject = await prisma.project.findUnique({
      where: { id: projectIdParsed },
    });

    if (!oldProject) {
      res.status(400).json({ message: 'No project found.' });
      return;
    }

    prisma.$transaction(async (tx) => {
      await deleteProjectDependencies(
        res,
        tx,
        AttachmentEntityType.PROJECT,
        projectIdParsed,
        userId
      );
      await tx.project.delete({
        where: { id: projectIdParsed },
      });
    });

    res.locals.logEvent = buildLogEvent({
      userId: userId,
      actorType: 'USER',
      action: 'DELETE_PROJECT',
      targetId: projectIdParsed,
      targetType: 'PROJECT',
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
