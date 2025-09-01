import { Request, Response } from 'express';
import { Prisma, PrismaClient, AttachmentEntityType } from '@prisma/client';
import { buildLogEvent } from '../services/buildLogEvent';
import { generateDiff } from '../services/generateDiff';
import { deleteCommentDependencies } from '../services/deletionServices/deleteCommentDependencies';
import { createResourceService } from '../services/organizationUsageServices/createResourceService';
import { deleteResourceService } from '../services/organizationUsageServices/deleteResourceService';
import { logBus } from '../lib/logBus';

export async function getAllComments(
  req: Request,
  res: Response,
  prisma: PrismaClient
) {
  try {
    const organizationId = res.locals.userInfo.organizationId;
    const comments = await prisma.comment.findMany({
      where: { organizationId: organizationId },
    });
    res
      .status(200)
      .json({ message: 'Comments were fetched successfully', data: comments });
    return;
  } catch (error) {
    console.error('Error fetching comments: ', error);
    res.status(500).json({ error: 'Failed to fetch comments' });
    return;
  }
}

export async function getCommentsByTicketId(
  req: Request,
  res: Response,
  prisma: PrismaClient
) {
  const organizationId = res.locals.userInfo.organizationId;
  const ticketId = res.locals.validatedParam;

  try {
    const ticketComments = await prisma.comment.findMany({
      where: { ticketId: ticketId, organizationId: organizationId },
    });
    res.status(200).json({
      message: 'Comments were fetched successfully',
      data: ticketComments,
    });
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
    const organizationId = res.locals.userInfo.organizationId;
    const userId = res.locals.userInfo.id;

    const commentData = res.locals.validatedBody;

    const resourceType = res.locals.resourceType;

    const comment = await createResourceService(
      prisma,
      resourceType,
      organizationId,
      async (tx) =>
        tx.comment.create({
          data: {
            ...commentData,
            authorId: userId,
            organizationId: organizationId,
          },
        })
    );

    const logEvents = [
      buildLogEvent({
        userId: userId,
        actorType: 'USER',
        action: 'CREATE_COMMENT',
        targetId: comment.id,
        targetType: 'COMMENT',
        organizationId: organizationId,
        metadata: {
          authorId: `${comment.authorId}`,
          content: `${comment.content}`,
          ticketId: `${comment.ticketId}`,
        },
      }),
    ];

    logBus.emit('activityLog', logEvents);

    res
      .status(201)
      .json({ message: 'Comment created successfully', data: comment });
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
    const organizationId = res.locals.userInfo.organizationId;
    const commentId = res.locals.validatedParam;

    const oldComment = await prisma.comment.findUniqueOrThrow({
      where: { id: commentId, organizationId: organizationId },
      select: {
        id: true,
        authorId: true,
        content: true,
        ticketId: true,
      },
    });

    await deleteResourceService(prisma, organizationId, async (tx) => {
      await deleteCommentDependencies(
        res,
        tx,
        AttachmentEntityType.COMMENT,
        commentId,
        userId,
        organizationId
      );
      await tx.comment.delete({
        where: { id: commentId, organizationId: organizationId },
      });
    });

    // The entityId for the purpose of logging is the ticketId for comments

    const deleteLog = [
      buildLogEvent({
        userId: userId,
        actorType: 'USER',
        action: 'DELETE_COMMENT',
        targetId: commentId,
        targetType: 'COMMENT',
        organizationId: organizationId,
        metadata: {
          id: oldComment?.id,
          authorId: oldComment?.authorId,
          content: oldComment?.content,
        },
      }),
    ];

    logBus.emit('activityLog', deleteLog);

    res.status(200).json({
      message: 'Comment deleted successfully',
      data: oldComment,
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
    const { content } = res.locals.validatedBody;
    const commentId = res.locals.validatedParam;
    const userId = res.locals.userInfo.id;
    const organizationId = res.locals.userInfo.organizationId;

    const oldComment = await prisma.comment.findUniqueOrThrow({
      where: { id: commentId, organizationId: organizationId },
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

    const updatedComment = await prisma.comment.update({
      where: { id: commentId, organizationId: organizationId },
      data: {
        content,
      },
    });

    const changes =
      oldComment && updatedComment
        ? generateDiff(oldComment, updatedComment)
        : {};

    const logEvents = [
      buildLogEvent({
        userId: userId,
        actorType: 'USER',
        action: 'UPDATE_COMMENT',
        targetId: commentId,
        targetType: 'COMMENT',
        organizationId: organizationId,
        metadata: {
          changes,
        },
      }),
    ];

    logBus.emit('activityLog', logEvents);

    res
      .status(200)
      .json({ message: 'Comment updated successfully', data: updatedComment });
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
