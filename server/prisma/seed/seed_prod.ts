import prisma from '../../src/lib/prisma';

import { seedBoardProd } from '../seedModules-prod/seedBoardProd';
import { seedOrganizationProd } from '../seedModules-prod/seedOrganizationProd';
import { seedProjectMemberProd } from '../seedModules-prod/seedProjectMemberProd';
import { seedProjectProd } from '../seedModules-prod/seedProjectProd';
import { seedTicketsProd } from '../seedModules-prod/seedTicketsProd';
import { seedUserProd } from '../seedModules-prod/seedUserProd';
import { seedOrgLimitsProd } from '../seedModules-prod/seedOrgLimitsProd';

async function main() {
  if (process.env.NODE_ENV !== 'production') {
    throw new Error('Production seed cannot run outside production');
  }

  console.log('NODE_ENV', process.env.NODE_ENV);

  if (process.env.DATABASE_URL?.includes('localhost')) {
    throw new Error('Refusing to run production seed against localhost');
  }

  if (!process.env.DATABASE_URL?.includes('oregon-postgres.render.com')) {
    throw new Error('Seed is NOT using Render external DB URL');
  }

  console.log('DATABASE_URL', process.env.DATABASE_URL);

  // Core entities
  const organization = await prisma.$transaction(async (tx) => {
    console.log('Seeding core entities');
    const organization = await seedOrganizationProd(tx);
    const user = await seedUserProd(tx, organization.id);
    const project = await seedProjectProd(tx, organization.id, user.id);
    await seedProjectMemberProd(tx, project.id, user.id, organization.id);
    const board = await seedBoardProd(tx, organization.id, project.id);
    await seedTicketsProd(tx, organization.id, user.id, board.id);

    return organization;
  });

  // Org Limits
  await prisma.$transaction(async (tx) => {
    console.log('Seeding organization limits');
    await seedOrgLimitsProd(tx, organization.id);
  });
}

main()
  .then(async () => {
    console.log('Seeding completed successfully.');
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('Error during seeding:', e);
    await prisma.$disconnect();
  });
