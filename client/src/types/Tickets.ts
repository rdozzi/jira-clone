export interface Tickets {
  assignee: { first_name: string; last_name: string };
  assigneeId: number;
  boardId: number;
  createdAt: Date;
  description: string;
  dueDate: Date;
  id: number;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  reporterId: number;
  status: 'BACKLOG' | 'IN_PROGRESS' | 'DONE';
  title: string;
  type: 'BUG' | 'TASK' | 'STORY';
  updatedAt: Date;
}
