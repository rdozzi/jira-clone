import { NextFunction, Request, Response } from 'express';
import { CustomRequest } from '../types/CustomRequest';
import { Prisma, PrismaClient } from '@prisma/client';
import { buildLogEvent } from '../services/buildLogEvent';
import { generateDiff } from '../services/generateDiff';

export async function getAllComments(
  req: Request,
  res: Response,
  prisma: PrismaClient
) {
  try {
    const comments = await prisma.comment.findMany();
    res.status(200).json(comments);
  } catch (error) {
    console.error('Error fetching comments: ', error);
    res.status(500).json({ error: 'Failed to fetch comments' });
  }
}

export async function getAllCommentsById(
  req: Request,
  res: Response,
  prisma: PrismaClient
) {
  const { ticketId } = req.params;
  try {
    const ticketComments = await prisma.comment.findMany({
      where: { ticketId: Number(ticketId) },
    });
    res.status(200).json(ticketComments);
  } catch (error) {
    console.error('Error fetching comments: ', error);
    res.status(500).json({ error: 'Failed to fetch comments' });
  }
}

export async function createComment(
  req: CustomRequest,
  res: Response,
  next: NextFunction,
  prisma: PrismaClient
) {
  try {
    const user = req.user;

    if (!user) {
      return res.status(401).json({ message: 'Unauthorized: User Not found' });
    }

    const commentData = req.body;
    const comment = await prisma.comment.create({
      data: commentData,
    });

    res.locals.logEvent = buildLogEvent({
      userId: user.id,
      actorType: 'USER',
      action: 'CREATE_COMMENT',
      targetId: comment.id,
      targetType: 'COMMENT',
      metadata: {
        authorId: `${comment.authorId}`,
        content: `${comment.content}`,
      },
      ticketId: comment.ticketId,
      boardId: null,
      projectId: null,
    });

    res.status(200).json(comment);
    next();
  } catch (error) {
    console.error('Error creating comment: ', error);
    res.status(500).json({ error: 'Failed to create comment' });
  }
}

export async function deleteComment(
  req: CustomRequest,
  res: Response,
  next: NextFunction,
  prisma: PrismaClient
) {
  try {
    const { id } = req.params;
    const convertedId = parseInt(id, 10);

    const user = req.user;
    if (!user) {
      return res.status(401).json({ message: 'Unauthorized: User Not found' });
    }

    const oldComment = await prisma.comment.findUniqueOrThrow({
      where: { id: convertedId },
      select: {
        id: true,
        authorId: true,
        content: true,
        ticketId: true,
      },
    });

    const deleteComment = await prisma.comment.delete({
      where: { id: Number(id) },
    });

    res.locals.logEvent = buildLogEvent({
      userId: null,
      actorType: 'USER',
      action: 'DELETE_COMMENT',
      targetId: convertedId,
      targetType: 'COMMENT',
      metadata: {
        id: oldComment?.id,
        authorId: oldComment?.authorId,
        content: oldComment?.content,
      },
      ticketId: oldComment?.ticketId,
      boardId: null,
      projectId: null,
    });

    res.status(200).json(deleteComment);
    next();
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2025'
    ) {
      return res.status(404).json({ message: 'Comment not found' });
    }
    console.error('Error fetching tickets: ', error);
    res.status(500).json({ error: 'Failed to fetch tickets' });
  }
}

export async function updateComment(
  req: CustomRequest,
  res: Response,
  next: NextFunction,
  prisma: PrismaClient
) {
  try {
    const { content } = req.body;
    const { commentId } = req.params;
    const convertedId = parseInt(commentId, 10);
    const user = req.user;

    if (!user) {
      return res.status(401).json({ message: 'Unauthorized: User Not found' });
    }

    if (typeof content !== 'string' || content.trim() === '') {
      res.status(400).json({
        error: 'Content is required and must be a non-empty string.',
      });
      return;
    }

    const oldComment = await prisma.comment.findUniqueOrThrow({
      where: { id: convertedId },
      select: {
        id: true,
        authorId: true,
        content: true,
        ticketId: true,
      },
    });

    if (!oldComment) {
      res.status(404).json({ error: `Comment not found` });
    }

    const updateComment = await prisma.comment.update({
      where: { id: Number(commentId) },
      data: {
        content,
      },
    });

    const changes =
      oldComment && updateComment
        ? generateDiff(oldComment, updateComment)
        : {};

    res.locals.logEvent = buildLogEvent({
      userId: user.id,
      actorType: 'USER',
      action: 'UPDATE_COMMENT',
      targetId: convertedId,
      targetType: 'COMMENT',
      metadata: {
        changes,
      },
      ticketId: updateComment.ticketId,
      boardId: null,
      projectId: null,
    });

    res.status(200).json(updateComment);
    next();
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2025'
    ) {
      return res.status(404).json({ message: 'Comment not found' });
    }
    console.error('Error editing comment: ', error);
    res.status(500).json({ error: 'Failed to edit comment' });
  }
}
