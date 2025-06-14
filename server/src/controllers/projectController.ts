import { Request, Response, NextFunction } from 'express';
import { PrismaClient, ProjectRole } from '@prisma/client';
import { buildLogEvent } from '../services/buildLogEvent';
import { generateDiff } from '../services/generateDiff';

export async function getAllProjects(
  req: Request,
  res: Response,
  prisma: PrismaClient
) {
  try {
    const projects = await prisma.project.findMany();
    res.status(200).json(projects);
  } catch (error) {
    console.error('Error fetching projects: ', error);
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
}

export async function getProjectById(
  req: Request,
  res: Response,
  prisma: PrismaClient
) {
  const { projectId } = req.params;
  const projectIdParsed = parseInt(projectId, 10);

  try {
    const projects = await prisma.project.findUnique({
      where: { id: projectIdParsed },
    });
    res.status(200).json(projects);
  } catch (error) {
    console.error('Error fetching projects: ', error);
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
}

export async function createProject(
  req: Request,
  res: Response,
  next: NextFunction,
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
        projectId: project.id,
        projectRole: projectMember.projectRole,
      },
      ticketId: null,
      boardId: null,
      projectId: project.id,
    });

    res.status(200).json({
      message: `Project ${project.name} created successfully`,
      project,
    });
    next();
  } catch (error) {
    console.error('Error creating project: ', error);
    res.status(500).json({ error: 'Failed to create project' });
  }
}

export async function updateProject(
  req: Request,
  res: Response,
  next: NextFunction,
  prisma: PrismaClient
) {
  try {
    const user = res.locals.userInfo;

    const { projectId } = req.params;
    const convertedId = parseInt(projectId, 10);

    if (isNaN(convertedId)) {
      return res.status(400).json({ message: 'Invalid project ID' });
    }

    const projectData = req.body;

    const oldProject = await prisma.project.findUnique({
      where: { id: convertedId },
    });

    const newProject = await prisma.project.update({
      where: { id: convertedId },
      data: { ...projectData },
    });

    const change =
      oldProject && newProject ? generateDiff(oldProject, newProject) : {};

    res.locals.logEvent = buildLogEvent({
      userId: user.id,
      actorType: 'USER',
      action: 'UPDATE_PROJECT',
      targetId: convertedId,
      targetType: 'PROJECT',
      metadata: {
        change,
      },
      ticketId: null,
      boardId: null,
      projectId: newProject.id,
    });

    res.status(201).json({
      message: `Project ${newProject.id} updated successfully`,
      newProject,
    });
  } catch (error) {
    console.error('Error creating project: ', error);
    res.status(500).json({ error: 'Failed to create project' });
  }
}

export async function deleteProject(
  req: Request,
  res: Response,
  next: NextFunction,
  prisma: PrismaClient
) {
  try {
    const user = res.locals.userInfo;

    const { projectId } = req.params;
    const convertedId = parseInt(projectId, 10);

    if (isNaN(convertedId)) {
      return res.status(400).json({ message: 'Invalid project ID' });
    }

    const oldProject = await prisma.project.findUnique({
      where: { id: convertedId },
    });

    const deletedProject = await prisma.project.delete({
      where: { id: convertedId },
    });

    res.locals.logEvent = buildLogEvent({
      userId: user.id,
      actorType: 'USER',
      action: 'DELETE_PROJECT',
      targetId: convertedId,
      targetType: 'PROJECT',
      metadata: {
        name: oldProject?.name,
        description: oldProject?.description,
        owner: oldProject?.ownerId,
      },
      ticketId: null,
      boardId: null,
      projectId: oldProject?.id,
    });

    res.status(200).json({
      message: `Project ${deletedProject.name} deleted successfully`,
      deletedProject,
    });
    next();
  } catch (error) {
    console.error('Error fetching project: ', error);
    res.status(500).json({ error: 'Failed to fetch project' });
  }
}
