import { useContext } from 'react';
import { ProjectModalContext } from './ProjectModalContext';

export function useProjectModal() {
  const context = useContext(ProjectModalContext);

  if (!context) {
    throw new Error(
      'useProjectModal must be used within a ProjectModalProvider',
    );
  }
  return context;
}
