import { createContext } from 'react';
import { Projects } from '../types/Projects';

interface ProjectInfoContextType {
  typedProjects: Projects[];
  isProjectLoading: boolean;
  selectedProject: Projects | null;
  setSelectedProject: (_selectedProject: Projects | null) => void;
  projectIdNumber: number;
  setProjectIdNumber: (_projectIdNumber: number) => void;
}

export const ProjectInfoContext = createContext<
  ProjectInfoContextType | undefined
>(undefined);
