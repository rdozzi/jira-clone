export interface ProjectMember {
  id: number;
  userId: number;
  projectId: number;
  projectRole: string;
  firstName: string;
  lastName: string;
  email: string;
  avatarUrl: string;
}

export const PROJECT_ROLES = ['VIEWER', 'USER', 'ADMIN'];
