export interface Projects {
  id: number;
  name: string;
  description: string;
  status: string;
  isPublic: boolean;
  ownerId: number;
  organizationId: number;
  createdAt: Date;
  updatedAt: Date;
}
