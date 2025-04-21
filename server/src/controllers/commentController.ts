import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

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
  prisma: PrismaClient
) {
  try {
    const commentData = req.body;
    const comment = await prisma.comment.create({
      data: commentData,
    });
    res.status(200).json(comment);
  } catch (error) {
    console.error('Error creating comment: ', error);
    res.status(500).json({ error: 'Failed to create comment' });
  }
}

export async function deleteComment(
  req: Request,
  res: Response,
  prisma: PrismaClient
) {
  try {
    const { id } = req.params;
    const deleteComment = await prisma.comment.delete({
      where: { id: Number(id) },
    });
    res.status(200).json(deleteComment);
  } catch (error) {
    console.error('Error fetching tickets: ', error);
    res.status(500).json({ error: 'Failed to fetch tickets' });
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
    console.log(commentId);

    if (typeof content !== 'string' || content.trim() === '') {
      res.status(400).json({
        error: 'Content is required and must be a non-empty string.',
      });
      return;
    }

    const updateComment = await prisma.comment.update({
      where: { id: Number(commentId) },
      data: {
        content,
      },
    });
    res.status(200).json(updateComment);
  } catch (error) {
    console.error('Error editing comment: ', error);
    res.status(500).json({ error: 'Failed to edit comment' });
  }
}
