// Logic to implement a SuperUser upon creation of an organization. This may not be applicable for the MVP.

// export async function seedSuperUser(
//   req: Request,
//   res: Response,
//   prisma: PrismaClient
// ) {
//   try {
//     const { email, firstName, lastName, password } = res.locals.validatedBody;

//     const hashedPassword = await hashPassword(password);

//     const newUser = await prisma.user.create({
//       data: {
//         email: email,
//         firstName: firstName,
//         lastName: lastName,
//         passwordHash: hashedPassword,
//         globalRole: GlobalRole.SUPERUSER,
//       },
//     });

//     res.locals.logEvent = buildLogEvent({
//       userId: newUser.id,
//       actorType: 'USER',
//       action: 'SEED_SUPERUSER',
//       targetId: newUser.id,
//       targetType: 'USER',
//       organizationId: null,
//       metadata: {
//         globalRole: `${newUser.globalRole}`,
//         name: `${newUser.firstName}_${newUser.lastName}`,
//         email: `${newUser.email}`,
//       },
//     });

//     res.status(201).json({
//       message: 'New SuperUser created successfully',
//       data: newUser,
//     });
//   } catch (error) {
//     console.error('Error creating user: ', error);
//     res.status(500).json({ error: 'Failed to create user' });
//     return;
//   }
// }
