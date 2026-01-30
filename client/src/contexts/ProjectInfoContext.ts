import { createContext } from 'react';
import { Project } from '../types/Project';

interface ProjectInfoContextType {
  typedProjects: Project[];
  isProjectLoading: boolean;
  selectedProject: Project | null;
  setSelectedProject: (_selectedProject: Project | null) => void;
  projectIdNumber: number;
}

export const ProjectInfoContext = createContext<
  ProjectInfoContextType | undefined
>(undefined);
