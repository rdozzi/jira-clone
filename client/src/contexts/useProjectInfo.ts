import { ProjectInfoContext } from './ProjectInfoContext';
import { useContext } from 'react';

export function useProjectInfo() {
  const context = useContext(ProjectInfoContext);

  if (!context) {
    throw new Error('useProjectInfo must be used within a ProjectInfoProvider');
  }

  return context;
}
