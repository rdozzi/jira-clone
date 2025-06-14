import { Request, Response, NextFunction } from 'express';
import { Prisma, PrismaClient } from '@prisma/client';
import { buildLogEvent } from '../services/buildLogEvent';
import { generateDiff } from '../services/generateDiff';

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
  const { boardId } = req.params;
  const convertedBoardId = parseInt(boardId, 10);
  try {
    const board = await prisma.board.findUnique({
      where: { id: convertedBoardId },
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
): Promise<void> {
  const { projectId } = req.params;
  const projectIdParse = parseInt(projectId, 10);
  try {
    const projectBoards = await prisma.board.findMany({
      where: { projectId: projectIdParse },
    });

    if (projectBoards.length === 0) {
      res
        .status(404)
        .json({ message: 'Could not find boards for that project Id' });
      return;
    }

    res.status(200).json(projectBoards);
  } catch (error) {
    console.error(`Error fetching boards for project ${projectId}: `, error);
    res
      .status(500)
      .json({ error: `Failed to fetch boards for project ${projectId}` });
    return;
  }
}

// Create board
export async function createBoard(
  req: Request,
  res: Response,
  next: NextFunction,
  prisma: PrismaClient
) {
  try {
    const userInfo = res.locals.userInfo;

    const boardData = req.body;
    const board = await prisma.board.create({
      data: boardData,
    });

    res.locals.logEvent = buildLogEvent({
      userId: userInfo.id,
      actorType: 'USER',
      action: 'CREATE_BOARD',
      targetId: board.id,
      targetType: 'BOARD',
      metadata: {
        name: `${board.name}`,
        description: `${board.description}`,
      },
      ticketId: null,
      boardId: board.id,
      projectId: board.projectId,
    });
    next();
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
  next: NextFunction,
  prisma: PrismaClient
) {
  try {
    const userInfo = res.locals.userInfo;
    const boardData = req.body;
    const { boardId } = req.params;
    const convertedBoardId = parseInt(boardId, 10);

    const oldBoard = await prisma.board.findUniqueOrThrow({
      where: { id: convertedBoardId },
      select: {
        id: true,
        name: true,
        projectId: true,
      },
    });

    const newBoard = await prisma.board.update({
      where: { id: convertedBoardId },
      data: {
        ...boardData,
      },
    });

    const changes =
      oldBoard && newBoard ? generateDiff(oldBoard, newBoard) : {};

    res.locals.logEvent = buildLogEvent({
      userId: userInfo.id,
      actorType: 'USER',
      action: 'UPDATE_BOARD',
      targetId: convertedBoardId,
      targetType: 'BOARD',
      metadata: {
        name: boardData.name,
        changes,
      },
      ticketId: null,
      boardId: oldBoard.id,
      projectId: oldBoard.projectId,
    });
    next();
    res.status(200).json(newBoard);
  } catch (error) {
    console.error('Error editing board: ', error);
    res.status(500).json({ error: 'Failed to edit board' });
  }
}

// Delete board
export async function deleteBoard(
  req: Request,
  res: Response,
  next: NextFunction,
  prisma: PrismaClient
) {
  try {
    const user = res.locals.userInfo;
    const { boardId } = req.params;
    const convertedBoardId = parseInt(boardId, 10);

    const oldBoard = await prisma.board.findUniqueOrThrow({
      where: { id: convertedBoardId },
      select: {
        id: true,
        name: true,
        projectId: true,
        description: true,
      },
    });

    if (!oldBoard) {
      res.status(404).json({ error: `Board not found` });
    }

    const deleteboard = await prisma.board.delete({
      where: { id: convertedBoardId },
    });

    res.locals.logEvent = buildLogEvent({
      userId: user.id,
      actorType: 'USER',
      action: 'DELETE_BOARD',
      targetId: convertedBoardId,
      targetType: 'BOARD',
      metadata: {
        id: oldBoard?.id,
        name: oldBoard?.name,
        description: oldBoard?.description,
      },
      ticketId: null,
      boardId: oldBoard.id,
      projectId: oldBoard.projectId,
    });
    next();
    res.status(200).json(deleteboard);
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2025'
    ) {
      return res.status(404).json({ message: 'Board not found' });
    }
    console.error('Error deleting board: ', error);
    res.status(500).json({ error: 'Failed to delete board' });
  }
}
