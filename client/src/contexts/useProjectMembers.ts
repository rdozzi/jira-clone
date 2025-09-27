import { ProjectMemberContext } from './ProjectMemberContext';
import { useContext } from 'react';

export function useProjectMembers() {
  const context = useContext(ProjectMemberContext);

  if (!context) {
    throw new Error(
      'useProjectMember must be used within a ProjectMemberProvider'
    );
  }

  return context;
}
