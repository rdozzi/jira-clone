import { useContext } from 'react';
import { ProjectMemberModalContext } from './ProjectMemberModalContext';

export function useProjectMemberModal() {
  const context = useContext(ProjectMemberModalContext);

  if (!context) {
    throw new Error(
      'useProjectModal must be used within a ProjectModalProvider',
    );
  }
  return context;
}
