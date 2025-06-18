import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { buildLogEvent } from '../services/buildLogEvent';

// Get all banned emails
export async function getAllBannedEmails(
  req: Request,
  res: Response,
  prisma: PrismaClient
) {
  try {
    const bannedEmail = await prisma.bannedEmail.findMany();
    return res.status(200).json(bannedEmail);
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
    const { bannedEmailId } = req.params;

    if (!bannedEmailId) {
      return res.status(400).json({ error: 'Banned email ID is required' });
    }

    const bannedEmailIdParsed = parseInt(String(bannedEmailId), 10);

    if (isNaN(bannedEmailIdParsed)) {
      return res.status(400).json({ error: 'Invalid banned email ID' });
    }

    // Fetch banned email by ID
    const bannedEmail = await prisma.bannedEmail.findUnique({
      where: { id: bannedEmailIdParsed },
    });

    if (!bannedEmail) {
      return res.status(404).json({ error: 'Banned email not found' });
    }

    return res.status(200).json({ bannedEmail: bannedEmail });
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
    const { email, reason } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    // Check if the email already exists
    const existingBannedEmail = await prisma.bannedEmail.findUnique({
      where: { email },
    });

    if (existingBannedEmail) {
      return res.status(409).json({ error: 'Email already banned' });
    }

    // Create a new banned email
    const newBannedEmail = await prisma.bannedEmail.create({
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
        createdAt: `${newBannedEmail.createdAt}`,
        reason: `${newBannedEmail.reason}`,
        email: `${newBannedEmail.email}`,
      },
    });

    return res.status(201).json({
      newBannedEmail: newBannedEmail,
      message: 'Banned email created successfully',
    });
  } catch (error) {
    console.error('Error creating banned email: ', error);
    return res.status(500).json({ error: 'Failed to create banned email' });
  }
}
