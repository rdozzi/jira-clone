import { PrismaClient, TokenPurpose } from '@prisma/client';
import { createToken } from './tokenFunctions';
import { sendTokenEmail } from './sendTokenEmail';
import { TTL } from '../../utilities/tokenUtilities/ttlMinutes';
import { buildLogEvent } from '../buildLogEvent';
import { logBus } from '../../lib/logBus';

// Service to INVITE a user to the organization
export async function accountInviteService(
  prisma: PrismaClient,
  hostUserId: number,
  userId: number,
  firstName: string,
  email: string,
  organizationId: number,
) {
  const ttlType: TokenPurpose = 'ACCOUNT_INVITE';

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
        action: 'EMAIL_ACCOUNT_INVITE',
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
