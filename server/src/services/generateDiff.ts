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
    const beforeValue = before[key];
    const afterValue = after[key];

    if (beforeValue !== afterValue) {
      diff[key] = {
        before: beforeValue,
        after: afterValue,
      };
    }
  }

  return diff;
}
