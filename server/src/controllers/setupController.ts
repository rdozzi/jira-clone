import { Request, Response } from 'express';
import { PrismaClient, OrganizationRole, Prisma } from '@prisma/client';
import { buildLogEvent } from '../services/buildLogEvent';
import { createCountTables } from '../services/setupServices/createCountTables';
import { logBus } from '../lib/logBus';
import { generateOrganizationSlug } from '../utilities/setupUtilities/generateOrganizationSlug';
import { tokenGenerationService } from '../services/tokenServices/tokenGenerationService';

export async function createOrganizationAndSuperAdmin(
  req: Request,
  res: Response,
  prisma: PrismaClient,
) {
  try {
    const { email, firstName, lastName, organizationName } =
      res.locals.validatedBody;

    const slugName = await generateOrganizationSlug(prisma, organizationName);

    // Update the organization and user with new user table specifications
    const result = await prisma.$transaction(async (tx) => {
      const newOrganization = await tx.organization.create({
        data: {
          name: organizationName,
          slug: slugName,
        },
      });

      const newUser = await tx.user.create({
        data: {
          email: email,
          firstName: firstName,
          lastName: lastName,
          organizationRole: OrganizationRole.SUPERADMIN,
          organizationId: newOrganization.id,
          mustChangePassword: true,
          isEmailVerified: false,
        },
      });

      await createCountTables(tx, newOrganization.id);

      return { newOrganization, newUser };
    });

    const { newOrganization, newUser } = result;

    await tokenGenerationService(
      prisma,
      newUser.id,
      newUser.id,
      newUser.firstName,
      newUser.email,
      newOrganization.id,
      'ACCOUNT_ACTIVATION',
      'ACCOUNT_ACTIVATION',
    );

    const logEvents = [
      buildLogEvent({
        userId: newUser.id,
        actorType: 'USER',
        action: 'CREATE_USER_AND_ORGANIZATION',
        targetId: newUser.id,
        targetType: 'USER',
        organizationId: newOrganization.id,
        metadata: {
          globalRole: `${newUser.globalRole}`,
          organizationRole: `${newUser.organizationRole}`,
          name: `${newUser.firstName}_${newUser.lastName}`,
          email: `${newUser.email}`,
          organization: newOrganization.name,
          orgSlug: newOrganization.slug,
        },
      }),
    ];

    logBus.emit('activityLog', logEvents);

    res.status(201).json({
      message: `Organization and user created successfully`,
      data: { organization: newOrganization, user: newUser },
    });
    return;
  } catch (error: unknown) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2002'
    ) {
      return res.status(409).json({
        message: 'SuperAdmin already exists. Contact for access.',
      });
    }
    console.error('Error creating user: ', error);
    res.status(500).json({ error: 'Failed to create user' });
    return;
  }
}
