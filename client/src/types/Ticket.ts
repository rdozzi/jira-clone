import type { Dayjs } from 'dayjs';
export type Priority = 'LOW' | 'MEDIUM' | 'HIGH';
export type Status = 'BACKLOG' | 'IN_PROGRESS' | 'DONE';
export type Type = 'BUG' | 'TASK' | 'STORY';

export interface Ticket {
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

export interface TicketDTO {
  assignee: { firstName: string; lastName: string };
  assigneeId: number;
  boardId: number;
  createdAt: string;
  description: string;
  dueDate: string;
  id: number;
  priority: Priority;
  reporterId: number;
  status: Status;
  title: string;
  type: Type;
  updatedAt: string;
}

export interface TicketFormValues {
  title: string;
  description: string;
  assigneeId: number;
  priority: Priority;
  status: Status;
  type: Type;
  dueDate: Dayjs;
}

// export interface TicketRecord {
//   assignee: { firstName: string; lastName: string };
//   assigneeId: number;
//   boardId: number;
//   createdAt: Date;
//   description: string;
//   dueDate: Date | string;
//   id: number;
//   priority: Priority;
//   reporterId: number;
//   status: string;
//   title: string;
//   type: string;
//   updatedAt: Date;
// }

// export type TicketModalPayload = {
//   record?: TicketRecord;
// };
