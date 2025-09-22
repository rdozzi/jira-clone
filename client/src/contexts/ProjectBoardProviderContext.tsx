import { useEffect, useState } from 'react';
import { BoardRef, ProjectRef } from '../types/projectBoard';
import { ProjectBoardContext } from './ProjectBoardContext';
import { useGetProjects } from '../features/projects/useGetProjects';
import { useGetBoardsByProjectId } from '../features/boards/useGetBoardsByProjectId';

type ProjectBoardProviderProps = { children: React.ReactNode };

export function ProjectBoardProviderContext({
  children,
}: ProjectBoardProviderProps) {
  const [project, setProject] = useState<ProjectRef | null>(null);
  const [board, setBoard] = useState<BoardRef | null>(null);

  // Derive Ids
  const projectId = project?.id ?? null;
  const boardId = board?.id ?? null;

  const clear = () => {
    setProject(null);
    setBoard(null);
  };

  const {
    projects,
    isLoading: isProjectLoading,
    error: projectError,
  } = useGetProjects();

  const {
    boards,
    isLoading: isBoardLoading,
    error: boardError,
  } = useGetBoardsByProjectId(projectId);

  useEffect(() => {
    if (project && boards?.length && !board) {
      setBoard(boards[0]);
    }
  }, [board, boards, project, setBoard]);

  return (
    <ProjectBoardContext.Provider
      value={{
        projects,
        isProjectLoading,
        projectError,
        boards,
        isBoardLoading,
        boardError,
        project,
        setProject,
        board,
        setBoard,
        projectId,
        boardId,
        clear,
      }}
    >
      {children}
    </ProjectBoardContext.Provider>
  );
}
