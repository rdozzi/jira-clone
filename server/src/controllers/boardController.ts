import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

// Get all Boards
export async function getAllBoards(
  req: Request,
  res: Response,
  prisma: PrismaClient
) {
  try {
    const boards = await prisma.board.findMany();
    res.status(200).json(boards);
  } catch (error) {
    console.error('Error fetching boards: ', error);
    res.status(500).json({ error: 'Failed to fetch boards' });
  }
}

// Get board by Id
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
// Get boards by Project Id
// Create board
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
// Update board
export async function updateTicket(
  req: Request,
  res: Response,
  prisma: PrismaClient
) {
  try {
    const ticketData = req.body;
    const { ticketId } = req.params;
    console.log(ticketId);
    const ticket = await prisma.ticket.update({
      where: { id: Number(ticketId) },
      data: {
        ...ticketData,
      },
    });
    res.status(200).json(ticket);
  } catch (error) {
    console.error('Error editing ticket: ', error);
    res.status(500).json({ error: 'Failed to edit ticket' });
  }
}

// Delete board
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
