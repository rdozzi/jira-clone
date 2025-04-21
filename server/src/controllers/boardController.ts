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
export async function getBoardById(
  req: Request,
  res: Response,
  prisma: PrismaClient
) {
  const { id } = req.params;
  try {
    const board = await prisma.board.findUnique({
      where: { id: Number(id) },
    });
    res.status(200).json(board);
  } catch (error) {
    console.error('Error fetching board: ', error);
    res.status(500).json({ error: 'Failed to fetch board' });
  }
}
// Get boards by Project Id
export async function getBoardsByProjectId(
  req: Request,
  res: Response,
  prisma: PrismaClient
) {
  const { projectId } = req.params;
  try {
    const projectBoards = await prisma.board.findMany({
      where: { projectId: Number(projectId) },
    });
    res.status(200).json(projectBoards);
  } catch (error) {
    console.error(`Error fetching boards for project ${projectId}: `, error);
    res
      .status(500)
      .json({ error: `Failed to fetch boards for project ${projectId}` });
  }
}

// Create board
export async function createBoard(
  req: Request,
  res: Response,
  prisma: PrismaClient
) {
  try {
    const boardData = req.body;
    const board = await prisma.board.create({
      data: boardData,
    });
    res.status(200).json(board);
  } catch (error) {
    console.error('Error creating board: ', error);
    res.status(500).json({ error: 'Failed to create board' });
  }
}

// Update board
export async function updateBoard(
  req: Request,
  res: Response,
  prisma: PrismaClient
) {
  try {
    const boardData = req.body;
    const { boardId } = req.params;
    console.log(boardId);
    const board = await prisma.board.update({
      where: { id: Number(boardId) },
      data: {
        ...boardData,
      },
    });
    res.status(200).json(board);
  } catch (error) {
    console.error('Error editing board: ', error);
    res.status(500).json({ error: 'Failed to edit board' });
  }
}

// Delete board
export async function deleteBoard(
  req: Request,
  res: Response,
  prisma: PrismaClient
) {
  try {
    const { boardId } = req.params;
    const deleteboard = await prisma.board.delete({
      where: { id: Number(boardId) },
    });
    res.status(200).json(deleteboard);
  } catch (error) {
    console.error('Error deleting board: ', error);
    res.status(500).json({ error: 'Failed to delete board' });
  }
}
