import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { buildLogEvent } from '../services/buildLogEvent';
import { generateDiff } from '../services/generateDiff';
import { deleteLabelDependencies } from '../services/deletionServices/deleteLabelDependencies';
import { createResourceService } from '../services/organizationUsageServices/createResourceService';
import { deleteResourceService } from '../services/organizationUsageServices/deleteResourceService';

//Get all labels
export async function getAllLabels(
  req: Request,
  res: Response,
  prisma: PrismaClient
) {
  try {
    const organizationId = res.locals.userInfo.organizationId;
    const labels = await prisma.label.findMany({
      where: { organizationId: organizationId },
    });
    res
      .status(200)
      .json({ message: 'Labels fetched successfully', data: labels });
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
    const organizationId = res.locals.userInfo.organizationId;
    const resourceType = res.locals.resourceType;

    // From validateCreateLabel Middleware
    const { name, color } = res.locals.validatedBody;

    const label = await createResourceService(
      prisma,
      resourceType,
      organizationId,
      async (tx) =>
        await tx.label.create({
          data: { name: name, color: color, organizationId: organizationId },
        })
    );

    res.locals.logEvent = buildLogEvent({
      userId: user.id,
      actorType: 'USER',
      action: 'CREATE_LABEL',
      targetId: label.id,
      targetType: 'LABEL',
      organizationId: organizationId,
      metadata: {
        name: `${label.name}`,
        color: `${label.color}`,
      },
    });

    res
      .status(201)
      .json({ message: 'Label created successfully', data: label });
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
    const organizationId = res.locals.userInfo.organizationId;

    // From validateCreateLabel Middleware
    const labelData = res.locals.validatedBody;
    const labelId = res.locals.validatedParam;

    const oldLabel = await prisma.label.findUniqueOrThrow({
      where: { id: labelId, organizationId: organizationId },
      select: { id: true, name: true, color: true },
    });

    const newLabel = await prisma.label.update({
      where: { id: labelId, organizationId: organizationId },
      data: {
        ...labelData,
      },
    });

    const change = oldLabel && newLabel ? generateDiff(oldLabel, newLabel) : {};

    res.locals.logEvent = buildLogEvent({
      userId: user.id,
      actorType: 'USER',
      action: 'UPDATE_LABEL',
      targetId: labelId,
      targetType: 'LABEL',
      organizationId: organizationId,
      metadata: {
        change,
      },
    });

    res
      .status(200)
      .json({ message: 'Label updated successfully', data: newLabel });
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
    const organizationId = res.locals.userInfo.organizationId;
    const labelId = res.locals.validatedParam;

    const oldLabel = await prisma.label.findUnique({
      where: { id: labelId, organizationId: organizationId },
    });

    await deleteResourceService(prisma, organizationId, async (tx) => {
      await deleteLabelDependencies(tx, labelId, null, organizationId);
      await tx.label.delete({
        where: { id: labelId, organizationId: organizationId },
      });
    });

    res.locals.logEvent = buildLogEvent({
      userId: user.id,
      actorType: 'USER',
      action: 'DELETE_LABEL',
      targetId: oldLabel?.id,
      targetType: 'LABEL',
      organizationId: organizationId,
      metadata: {
        name: `${oldLabel?.name}`,
        color: `${oldLabel?.color}`,
      },
    });

    res
      .status(200)
      .json({ message: 'Label deleted successfully', data: oldLabel });
    return;
  } catch (error) {
    console.error('Error delete label: ', error);
    res.status(500).json({ error: 'Failed to delete label' });
    return;
  }
}
