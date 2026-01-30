export interface Project {
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

// ProjetViewAllProjects is used in this component, ProjectViewAllItemButton, and apiProjects

export type ProjectViewAllProjects = Pick<
  Project,
  'id' | 'name' | 'status' | 'description' | 'status' | 'isPublic'
> & {
  owner: {
    firstName: string;
    lastName: string;
  };
};
