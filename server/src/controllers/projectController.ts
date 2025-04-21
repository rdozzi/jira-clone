import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

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
  const { id } = req.params;
  try {
    const projects = await prisma.project.findUnique({
      where: { id: Number(id) },
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
  prisma: PrismaClient
) {
  try {
    const projectData = req.body;
    const project = await prisma.project.create({
      data: projectData,
    });
    res.status(200).json(project);
  } catch (error) {
    console.error('Error creating project: ', error);
    res.status(500).json({ error: 'Failed to create project' });
  }
}

export async function deleteProject(
  req: Request,
  res: Response,
  prisma: PrismaClient
) {
  try {
    const { id } = req.params;
    const deleteProject = await prisma.project.delete({
      where: { id: Number(id) },
    });
    res.status(200).json(deleteProject);
  } catch (error) {
    console.error('Error fetching project: ', error);
    res.status(500).json({ error: 'Failed to fetch project' });
  }
}
