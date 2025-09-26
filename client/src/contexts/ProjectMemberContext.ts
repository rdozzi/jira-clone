import { createContext } from 'react';
import { ProjectMember } from '../types/ProjectMember';
import { QueryObserverResult } from '@tanstack/react-query';

interface ProjectMemberContextType {
  projectMembers: ProjectMember[] | undefined;
  isLoading: boolean;
  error: Error | null;
  refreshProjectMember: () => Promise<QueryObserverResult<any, Error>>;
}

export const ProjectMemberContext = createContext<
  ProjectMemberContextType | undefined
>(undefined);
