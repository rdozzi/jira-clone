// import { useState } from 'react';
// import { BoardRef, ProjectRef } from '../types/projectBoard';
import { ProjectBoardContext } from './ProjectBoardContext';
import { useGetProjects } from '../features/projects/useGetProjects';
import { useGetBoards } from '../features/boards/useGetBoards';

type ProjectBoardProviderProps = { children: React.ReactNode };

export function ProjectBoardProviderContext({
  children,
}: ProjectBoardProviderProps) {
  // const [project, setProject] = useState<ProjectRef | null>(null);
  // const [board, setBoard] = useState<BoardRef | null>(null);

  // const clear = () => {
  //   setProject(null);
  //   setBoard(null);
  // };

  const {
    projects,
    isLoading: isProjectLoading,
    error: projectError,
  } = useGetProjects();

  const {
    boards,
    isLoading: isBoardLoading,
    error: boardError,
  } = useGetBoards();

  return (
    <ProjectBoardContext.Provider
      value={{
        projects,
        isProjectLoading,
        projectError,
        boards,
        isBoardLoading,
        boardError,
      }}
    >
      {children}
    </ProjectBoardContext.Provider>
  );
}
