import { Request, Response } from 'express';
import { Prisma, PrismaClient } from '@prisma/client';
import { buildLogEvent } from '../services/buildLogEvent';
import { generateDiff } from '../services/generateDiff';
import { deleteCommentCascade } from '../services/deletionServices/deleteCommentCascade';

export async function getAllComments(
  req: Request,
  res: Response,
  prisma: PrismaClient
) {
  try {
    const comments = await prisma.comment.findMany();
    res.status(200).json(comments);
    return;
  } catch (error) {
    console.error('Error fetching comments: ', error);
    res.status(500).json({ error: 'Failed to fetch comments' });
    return;
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
    return;
  } catch (error) {
    console.error('Error fetching comments: ', error);
    res.status(500).json({ error: 'Failed to fetch comments' });
    return;
  }
}

export async function createComment(
  req: Request,
  res: Response,
  prisma: PrismaClient
) {
  try {
    const userId = res.locals.userInfo.id;

    const commentData = req.body;
    const comment = await prisma.comment.create({
      data: { ...commentData, authorId: userId },
    });

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

    prisma.$transaction(async (tx) => {
      await deleteCommentCascade(res, tx, commentIdParsed);
      await tx.comment.delete({
        where: { id: commentIdParsed },
      });
    });

    // The entityId for the purpose of logging is the ticketId for comments

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
      },
    });

    res.status(200).json({
      message: 'Comment deleted successfully',
      deleteComment: deleteComment,
    });
    return;
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2025'
    ) {
      res.status(404).json({ message: 'Comment not found' });
      return;
    }
    console.error('Error fetching comment: ', error);
    res.status(500).json({ error: 'Failed to fetch comment' });
    return;
  }
}

export async function updateComment(
  req: Request,
  res: Response,
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
      return;
    }

    const updateComment = await prisma.comment.update({
      where: { id: commentIdParsed },
      data: {
        content,
      },
    });

    const changes =
      oldComment && updateComment
        ? generateDiff(oldComment, updateComment)
        : {};

    res.locals.logEvent = buildLogEvent({
      userId: userId,
      actorType: 'USER',
      action: 'UPDATE_COMMENT',
      targetId: commentIdParsed,
      targetType: 'COMMENT',
      metadata: {
        changes,
      },
    });

    res
      .status(200)
      .json({ message: 'Comment updated successfully', updateComment });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2025'
    ) {
      res.status(404).json({ message: 'Comment not found' });
      return;
    }
    console.error('Error editing comment: ', error);
    res.status(500).json({ error: 'Failed to edit comment' });
    return;
  }
}
