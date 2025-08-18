export const DAILY_ORG_LIMITS = {
  Project: 3,
  Board: 10,
  Ticket: 100,
  Comment: 300,
  User: undefined,
  FileStorage: 100 * 1024 * 1024, // 1MB/Day
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
  FileStorage: 1024 * 1024 * 1024, // 1GB/Day
  ActivityLog: 50000,
  Label: 100,
  BannedEmail: 100,
};
