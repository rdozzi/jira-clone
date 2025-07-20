import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { buildLogEvent } from '../services/buildLogEvent';

// Get all banned email records
export async function getAllBannedEmails(
  req: Request,
  res: Response,
  prisma: PrismaClient
) {
  try {
    const bannedEmailRecords = await prisma.bannedEmail.findMany();
    return res.status(200).json(bannedEmailRecords);
  } catch (error) {
    console.error('Error fetching bannedEmail: ', error);
    return res.status(500).json({ error: 'Failed to fetch bannedEmail' });
  }
}

// Get banned email by Id
export async function getBannedEmailById(
  req: Request,
  res: Response,
  prisma: PrismaClient
) {
  try {
    const bannedEmailId = res.locals.validatedParam;

    // Fetch banned email record by ID
    const bannedEmailRecord = await prisma.bannedEmail.findUnique({
      where: { id: bannedEmailId },
    });

    if (!bannedEmailRecord) {
      return res.status(404).json({ error: 'Banned email not found' });
    }

    return res.status(200).json(bannedEmailRecord);
  } catch (error) {
    console.error('Error fetching banned email: ', error);
    return res.status(500).json({ error: 'Failed to fetch banned email' });
  }
}

// Create a new banned email
export async function createBannedEmail(
  req: Request,
  res: Response,
  prisma: PrismaClient
) {
  try {
    const { email, reason } = res.locals.validatedBody;

    // Check if the email already exists
    const existingBannedEmail = await prisma.bannedEmail.findUnique({
      where: { email },
    });

    if (existingBannedEmail) {
      return res.status(409).json({ error: 'Email already banned' });
    }

    // Create a new banned email
    const bannedEmail = await prisma.bannedEmail.create({
      data: { email, reason },
    });

    // Log the event
    res.locals.logEvent = buildLogEvent({
      userId: null,
      actorType: 'USER',
      action: 'BAN_USER',
      targetId: null,
      targetType: 'USER',
      metadata: {
        createdAt: `${bannedEmail.createdAt}`,
        reason: `${bannedEmail.reason}`,
        email: `${bannedEmail.email}`,
      },
    });

    return res.status(201).json({
      bannedEmail: bannedEmail.email,
      reason: bannedEmail.reason,
      message: 'Banned email created successfully',
    });
  } catch (error) {
    console.error('Error creating banned email: ', error);
    return res.status(500).json({ error: 'Failed to create banned email' });
  }
}
