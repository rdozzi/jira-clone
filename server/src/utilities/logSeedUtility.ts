export function logSeedUtility({ seeds, modelName, prisma }) {
  for (const seed of seeds) {
    /* eslint-disable  @typescript-eslint/no-explicit-any */
    const model = prisma[modelName as keyof typeof prisma] as any;

    const entryExists = model.findUnique({
      where: { id: seed.id },
    });
    if (entryExists) {
      console.log(
        `Entry with ID ${seed.id} already exists in ${modelName}. Entry updated if applicable.`
      );
    } else {
      console.log(`Created entry in ${modelName} with ID ${seed.id}.`);
    }
  }
}
