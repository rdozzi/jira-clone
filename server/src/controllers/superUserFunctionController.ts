import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { buildLogEvent } from '../services/buildLogEvent';
import { findManyQueryService } from '../services/superUserFunctionServices/findManyQueryService';
import { createService } from '../services/superUserFunctionServices/createService';
import { updateService } from '../services/superUserFunctionServices/updateService';
import { deleteService } from '../services/superUserFunctionServices/deleteService';
import { generateDiff } from '../services/generateDiff';
import { getOldRecordService } from '../services/superUserFunctionServices/getOldRecordService';

export async function getRecords(
  req: Request,
  res: Response,
  prisma: PrismaClient
) {
  try {
    const userInfo = res.locals.userInfo;

    // From validate multiple params
    const { resource, organizationId, recordId } = res.locals.validatedParams;
    const data = await findManyQueryService(
      prisma,
      resource,
      organizationId,
      recordId
    );

    if (data.length === 0) {
      res.status(404).json({ message: 'No records exist' });
    }

    res.locals.logEvent = buildLogEvent({
      userId: userInfo.id,
      actorType: 'USER',
      action: 'GET_RESOURCE_BY_SUPERUSER',
      targetId: recordId,
      targetType: resource,
      organizationId: organizationId,
      metadata: {
        recordId: recordId,
        timestamp: new Date().toISOString(),
      },
    });

    res.status(200).json({ message: `Data fetched successfully`, data: data });
    return;
  } catch (error) {
    console.error('Error fetching users: ', error);
    res.status(500).json({ error: 'Failed to fetch users' });
    return;
  }
}

export async function createRecord(
  req: Request,
  res: Response,
  prisma: PrismaClient
) {
  try {
    const userInfo = res.locals.userInfo;

    // From validate multiple params
    const { resource, organizationId } = res.locals.validatedParams;
    const resourceBody = res.locals.validatedBody;

    const data = await createService(prisma, resource, resourceBody, res);

    res.locals.logEvent = buildLogEvent({
      userId: userInfo.id,
      actorType: 'USER',
      action: 'CREATE_RESOURCE_BY_SUPERUSER',
      targetId: data?.id,
      targetType: resource,
      organizationId: organizationId,
      metadata: {
        timestamp: new Date().toISOString(),
      },
    });

    res
      .status(200)
      .json({ message: `Record created successfully`, data: data });
    return;
  } catch (error) {
    console.error('Error fetching users: ', error);
    res.status(500).json({ error: 'Failed to fetch users' });
    return;
  }
}

export async function updateRecord(
  req: Request,
  res: Response,
  prisma: PrismaClient
) {
  try {
    const userInfo = res.locals.userInfo;

    // From validate multiple params
    const { resource, organizationId, recordId } = res.locals.validatedParams;
    const resourceBody = res.locals.validatedBody;

    const oldData = await getOldRecordService(
      prisma,
      resource,
      organizationId,
      recordId
    );

    const data = await updateService(
      prisma,
      resource,
      organizationId,
      recordId,
      resourceBody,
      res
    );

    const changes = oldData && data ? generateDiff(oldData, data) : {};

    res.locals.logEvent = buildLogEvent({
      userId: userInfo.id,
      actorType: 'USER',
      action: 'UPDATE_RESOURCE_BY_SUPERUSER',
      targetId: oldData?.id,
      targetType: resource,
      organizationId: organizationId,
      metadata: {
        timestamp: new Date().toISOString(),
        changes,
      },
    });

    res
      .status(200)
      .json({ message: `Record updated successfully`, data: data });
    return;
  } catch (error) {
    console.error('Error fetching users: ', error);
    res.status(500).json({ error: 'Failed to fetch users' });
    return;
  }
}

export async function deleteRecord(
  req: Request,
  res: Response,
  prisma: PrismaClient
) {
  try {
    const userInfo = res.locals.userInfo;
    const { resource, organizationId, recordId } = res.locals.validatedParams;

    const oldData = await getOldRecordService(
      prisma,
      resource,
      organizationId,
      recordId
    );

    await deleteService(
      prisma,
      resource,
      organizationId,
      recordId,
      userInfo.id,
      res
    );

    res.locals.logEvent = buildLogEvent({
      userId: userInfo.id,
      actorType: 'USER',
      action: 'DELETE_RESOURCE_BY_SUPERUSER',
      targetId: oldData?.id,
      targetType: resource,
      organizationId: organizationId,
      metadata: {
        timestamp: new Date().toISOString(),
      },
    });

    res
      .status(200)
      .json({ message: `Record deleted successfully`, data: oldData });
    return;
  } catch (error) {
    console.error('Error deleting user: ', error);
    res.status(500).json({ error: 'Failed to fetch users' });
    return;
  }
}
