export type Priority = 'LOW' | 'MEDIUM' | 'HIGH';
export type Status = 'BACKLOG' | 'IN_PROGRESS' | 'DONE';
export type Type = 'BUG' | 'TASK' | 'STORY';

export interface Tickets {
  assignee: { firstName: string; lastName: string };
  assigneeId: number;
  boardId: number;
  createdAt: Date;
  description: string;
  dueDate: Date;
  id: number;
  priority: Priority;
  reporterId: number;
  status: Status;
  title: string;
  type: Type;
  updatedAt: Date;
}

export interface CalendarTickets {
  assignee: { firstName: string; lastName: string };
  assigneeId: number;
  boardId: number;
  createdAt: Date;
  description: string;
  dueDate: string;
  id: number;
  priority: string;
  reporterId: number;
  status: string;
  title: string;
  type: string;
  updatedAt: Date;
}
