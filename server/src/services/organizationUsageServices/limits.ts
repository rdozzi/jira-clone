export const DAILY_ORG_LIMITS = {
  Project: 10,
  Board: 25,
  Ticket: 2500,
  Comment: 10000,
  User: undefined,
  FileStorage: 500 * 1024 * 1024, // 500 MB/Day
  ActivityLog: undefined,
  Label: undefined,
  BannedEmail: undefined,
} as const;

export const TOTAL_ORG_LIMITS = {
  Project: 20,
  Board: 50,
  Ticket: 5000,
  Comment: 20000,
  User: 1000,
  FileStorage: 1024 * 1024 * 1024, // 1GB
  ActivityLog: 50000,
  Label: 100,
  BannedEmail: 100,
};
