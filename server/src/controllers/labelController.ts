import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { buildLogEvent } from '../services/buildLogEvent';
import { generateDiff } from '../services/generateDiff';
import { deleteLabelDependencies } from '../services/deletionServices/deleteLabelDependencies';

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
  prisma: PrismaClient
) {
  try {
    const user = res.locals.userInfo;

    // From validateCreateLabel Middleware
    const { name, color } = res.locals.validatedBody;

    const label = await prisma.label.create({
      data: { name: name, color: color },
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
    });

    res.status(200).json({ message: 'Label successfully created', label });
    return;
  } catch (error) {
    console.error('Error creating label: ', error);
    res.status(500).json({ error: 'Failed to create label' });
    return;
  }
}

//Update a label
export async function updateLabel(
  req: Request,
  res: Response,
  prisma: PrismaClient
) {
  try {
    const user = res.locals.userInfo;

    // From validateCreateLabel Middleware
    const labelData = res.locals.validatedBody;
    const { labelId } = req.params;

    const labelIdParsed = parseInt(labelId, 10);

    const oldLabel = await prisma.label.findUniqueOrThrow({
      where: { id: labelIdParsed },
      select: { id: true, name: true, color: true },
    });

    const newLabel = await prisma.label.update({
      where: { id: labelIdParsed },
      data: {
        ...labelData,
      },
    });

    const change = oldLabel && newLabel ? generateDiff(oldLabel, newLabel) : {};

    res.locals.logEvent = buildLogEvent({
      userId: user.id,
      actorType: 'USER',
      action: 'UPDATE_LABEL',
      targetId: labelIdParsed,
      targetType: 'LABEL',
      metadata: {
        change,
      },
    });

    res.status(200).json({ message: 'Label successfully updated', newLabel });
    return;
  } catch (error) {
    console.error('Error editing label: ', error);
    res.status(500).json({ error: 'Failed to edit label' });
  }
}

//Delete a label
export async function deleteLabel(
  req: Request,
  res: Response,
  prisma: PrismaClient
) {
  try {
    const user = res.locals.userInfo;

    const { labelId } = req.params;
    const labelIdParsed = parseInt(labelId, 10);

    const oldLabel = await prisma.label.findUnique({
      where: { id: labelIdParsed },
    });

    prisma.$transaction(async (tx) => {
      await deleteLabelDependencies(tx, labelIdParsed, null);
      await tx.label.delete({
        where: { id: labelIdParsed },
      });
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
    });

    res
      .status(200)
      .json({ message: 'Label successfully deleted', deletedLabel: oldLabel });
    return;
  } catch (error) {
    console.error('Error delete label: ', error);
    res.status(500).json({ error: 'Failed to delete label' });
    return;
  }
}
