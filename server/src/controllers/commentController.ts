import { NextFunction, Request, Response } from 'express';
import { Prisma, PrismaClient, AttachmentEntityType } from '@prisma/client';
import { buildLogEvent } from '../services/buildLogEvent';
import { generateDiff } from '../services/generateDiff';
import { generateEntityIdForLog } from '../utilities/generateEntityIdForLog';
import { deleteCommentCascade } from '../services/deletionServices/deleteCommentCascade';

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
  req: Request,
  res: Response,
  next: NextFunction,
  prisma: PrismaClient
) {
  try {
    const userId = res.locals.userInfo.id;

    const commentData = req.body;
    const comment = await prisma.comment.create({
      data: { ...commentData, authorId: userId },
    });

    // The entityId for the purpose of logging is the ticketId for comments
    const logIdObject = generateEntityIdForLog(
      AttachmentEntityType.COMMENT,
      comment.ticketId
    );

    res.locals.logEvent = buildLogEvent({
      userId: userId,
      actorType: 'USER',
      action: 'CREATE_COMMENT',
      targetId: comment.id,
      targetType: 'COMMENT',
      metadata: {
        authorId: `${comment.authorId}`,
        content: `${comment.content}`,
        ticketId: `${comment.ticketId}`,
      },
      ticketId: logIdObject.ticketId,
      boardId: logIdObject.boardId,
      projectId: logIdObject.projectId,
    });

    res.status(200).json(comment);
    return;
  } catch (error) {
    console.error('Error creating comment: ', error);
    res.status(500).json({ error: 'Failed to create comment' });
    return;
  }
}

export async function deleteComment(
  req: Request,
  res: Response,
  next: NextFunction,
  prisma: PrismaClient
) {
  try {
    const userId = res.locals.userInfo.id;

    const { commentId } = req.params;
    const commentIdParsed = parseInt(commentId, 10);

    const oldComment = await prisma.comment.findUniqueOrThrow({
      where: { id: commentIdParsed },
      select: {
        id: true,
        authorId: true,
        content: true,
        ticketId: true,
      },
    });

    await deleteCommentCascade(req, res, prisma, commentIdParsed);

    const deleteComment = await prisma.comment.delete({
      where: { id: commentIdParsed },
    });

    // The entityId for the purpose of logging is the ticketId for comments
    const logIdObject = generateEntityIdForLog(
      AttachmentEntityType.COMMENT,
      oldComment.id
    );

    res.locals.logEvent = buildLogEvent({
      userId: userId,
      actorType: 'USER',
      action: 'DELETE_COMMENT',
      targetId: commentIdParsed,
      targetType: 'COMMENT',
      metadata: {
        id: oldComment?.id,
        authorId: oldComment?.authorId,
        content: oldComment?.content,
        commentId: logIdObject.commentId,
      },
      ticketId: oldComment.ticketId,
      boardId: logIdObject.boardId,
      projectId: logIdObject.projectId,
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
    console.error('Error fetching comment: ', error);
    res.status(500).json({ error: 'Failed to fetch comment' });
  }
}

export async function updateComment(
  req: Request,
  res: Response,
  next: NextFunction,
  prisma: PrismaClient
) {
  try {
    const { content } = req.body;
    const { commentId } = req.params;
    const commentIdParsed = parseInt(commentId, 10);
    const userId = res.locals.userInfo.id;

    if (typeof content !== 'string' || content.trim() === '') {
      res.status(400).json({
        error: 'Content is required and must be a non-empty string.',
      });
      return;
    }

    const oldComment = await prisma.comment.findUniqueOrThrow({
      where: { id: commentIdParsed },
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

    // The entityId for the purpose of logging is the ticketId for comments
    const logIdObject = generateEntityIdForLog(
      AttachmentEntityType.COMMENT,
      updateComment.ticketId
    );

    res.locals.logEvent = buildLogEvent({
      userId: userId,
      actorType: 'USER',
      action: 'UPDATE_COMMENT',
      targetId: commentIdParsed,
      targetType: 'COMMENT',
      metadata: {
        changes,
      },
      ticketId: logIdObject.ticketId,
      boardId: logIdObject.boardId,
      projectId: logIdObject.projectId,
    });

    res.status(200).json(updateComment);
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
