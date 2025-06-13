import { NextFunction, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { buildLogEvent } from '../services/buildLogEvent';
import { generateDiff } from '../services/generateDiff';

//Get all labels
export async function getAllLabels(
  req: Request,
  res: Response,
  prisma: PrismaClient
) {
  try {
    const labels = await prisma.label.findMany();
    res.status(200).json(labels);
  } catch (error) {
    console.error('Error fetching labels: ', error);
    res.status(500).json({ error: 'Failed to fetch labels' });
  }
}

//Create a label
export async function createNewLabel(
  req: Request,
  res: Response,
  next: NextFunction,
  prisma: PrismaClient
) {
  try {
    const user = res.locals.userInfo;

    const labelData = req.body;
    const label = await prisma.label.create({
      data: labelData,
    });

    res.locals.logEvent = buildLogEvent({
      userId: user.id,
      actorType: 'USER',
      action: 'CREATE_LABEL',
      targetId: label.id,
      targetType: 'LABEL',
      metadata: {
        name: `${label.name}`,
        color: `${label.color}`,
      },
      ticketId: null,
      boardId: null,
      projectId: null,
    });

    res.status(200).json({ message: 'Label successfully created', label });
    next();
  } catch (error) {
    console.error('Error creating label: ', error);
    res.status(500).json({ error: 'Failed to create label' });
  }
}

//Update a label
export async function updateLabel(
  req: Request,
  res: Response,
  next: NextFunction,
  prisma: PrismaClient
) {
  try {
    const user = res.locals.userInfo;

    const labelData = req.body;
    const { labelId } = req.params;
    const convertedId = parseInt(labelId, 10);

    const oldLabel = await prisma.label.findUniqueOrThrow({
      where: { id: convertedId },
      select: { id: true, name: true, color: true },
    });

    const newLabel = await prisma.label.update({
      where: { id: Number(labelId) },
      data: {
        ...labelData,
      },
    });

    const change = oldLabel && newLabel ? generateDiff(oldLabel, newLabel) : {};

    res.locals.logEvent = buildLogEvent({
      userId: user.id,
      actorType: 'USER',
      action: 'UPDATE_LABEL',
      targetId: convertedId,
      targetType: 'LABEL',
      metadata: {
        change,
      },
      ticketId: null,
      boardId: null,
      projectId: null,
    });

    res.status(200).json({ message: 'Label successfully updated', newLabel });
    next();
  } catch (error) {
    console.error('Error editing label: ', error);
    res.status(500).json({ error: 'Failed to edit label' });
  }
}

//Delete a label
export async function deleteLabel(
  req: Request,
  res: Response,
  next: NextFunction,
  prisma: PrismaClient
) {
  try {
    const user = res.locals.userInfo;

    const { labelId } = req.params;
    const convertedId = parseInt(labelId, 10);

    const oldLabel = await prisma.label.findUnique({
      where: { id: convertedId },
    });

    const deleteLabel = await prisma.label.delete({
      where: { id: convertedId },
    });

    res.locals.logEvent = buildLogEvent({
      userId: user.id,
      actorType: 'USER',
      action: 'DELETE_LABEL',
      targetId: oldLabel?.id,
      targetType: 'LABEL',
      metadata: {
        name: `${oldLabel?.name}`,
        color: `${oldLabel?.color}`,
      },
      ticketId: null,
      boardId: null,
      projectId: null,
    });

    res
      .status(200)
      .json({ message: 'Label successfully deleted', deleteLabel });
    next();
  } catch (error) {
    console.error('Error delete label: ', error);
    res.status(500).json({ error: 'Failed to delete label' });
  }
}
