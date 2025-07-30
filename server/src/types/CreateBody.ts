import { Status, Priority, Type } from '@prisma/client';

export interface CreateProjectBody {
  name: string;
  description: string;
  ownerId: number;
  organizationId: number;
}

export interface CreateBoardBody {
  name: string;
  description: string;
  projectId: number;
  organizationId: number;
}

export interface CreateTicketBody {
  title: string;
  description: string;
  status: Status;
  priority: Priority;
  type: Type;
  assigneeId: number;
  reporterId: number;
  boardId: number;
  dueDate: string;
  organizationId: number;
}

export interface CreateCommentBody {
  ticketId: number;
  content: string;
  organizationId: number;
}
