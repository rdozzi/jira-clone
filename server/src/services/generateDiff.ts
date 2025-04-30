export type DiffResult = {
  [key: string]: {
    before: string | number | Date | null;
    after: string | number | Date | null;
  };
};

export function generateDiff<
  T extends Record<string, string | number | Date | null>,
>(before: T, after: T): DiffResult {
  const diff: DiffResult = {};

  for (const key of Object.keys(after)) {
    if (key === 'createdAt' || key === 'updatedAt') {
      continue;
    }

    const beforeValue = before[key];
    const afterValue = after[key];

    if (beforeValue instanceof Date && afterValue instanceof Date) {
      if (beforeValue.getTime() !== afterValue.getTime()) {
        diff[key] = {
          before: beforeValue,
          after: afterValue,
        };
      }
    } else if (beforeValue !== afterValue) {
      diff[key] = {
        before: beforeValue,
        after: afterValue,
      };
    }
  }

  return diff;
}
