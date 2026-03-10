import { PrismaClient, TokenPurpose } from '@prisma/client';
import { createToken } from './tokenFunctions';
import { sendTokenEmail } from './sendTokenEmail';
import { TTL } from '../../utilities/tokenUtilities/ttlMinutes';
import { buildLogEvent } from '../buildLogEvent';
import { logBus } from '../../lib/logBus';

// Service to generate and email token to a user. Accommodates all three types: "RESET_PASSWORD" | "ACCOUNT_ACTIVATION" | "ACCOUNT_INVITE"
export async function tokenGenerationService(
  prisma: PrismaClient,
  hostUserId: number,
  userId: number,
  firstName: string,
  email: string,
  organizationId: number,
  ttlType: TokenPurpose,
) {
  // Create a token
  const rawToken = await prisma.$transaction(async (tx) => {
    return createToken(tx, {
      userId,
      purpose: TokenPurpose.ACCOUNT_ACTIVATION,
      ttlMinutesType: ttlType,
      organizationId,
    });
  });

  try {
    // Define expiresIn value
    const expiresIn = TTL[ttlType];

    // Define the url with token
    const resetUrl = `${process.env.FRONTEND_URL}/change-password?token=${rawToken}`;

    // Send email
    const { messageId, messageUrl } = await sendTokenEmail(
      email,
      firstName,
      resetUrl,
      expiresIn,
      'resetPassword',
      'resetPasswordText',
    );

    const logEvents = [
      buildLogEvent({
        userId: hostUserId,
        actorType: 'USER',
        action: ttlType,
        targetId: userId,
        targetType: 'USER',
        organizationId: organizationId,
        metadata: {},
      }),
    ];

    logBus.emit('activityLog', logEvents);

    return { messageId, messageUrl, rawToken };
  } catch (error) {
    console.error('Failed to send password setup email', error);

    // token still exists and is valid
    return { token: rawToken };
  }
}
