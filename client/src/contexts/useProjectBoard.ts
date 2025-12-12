import { ProjectBoardContext } from './ProjectBoardContext';
import { useContext } from 'react';

export function useProjectBoard() {
  const context = useContext(ProjectBoardContext);

  if (!context) {
    throw new Error(
      'useProjectBoard must be used within a ProjectBoardProvider'
    );
  }

  return context;
}
