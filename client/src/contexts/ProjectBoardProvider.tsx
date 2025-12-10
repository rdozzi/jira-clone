import { useEffect, useState } from 'react';
import { BoardRef, ProjectRef } from '../types/projectBoard';
import { Boards } from '../types/Boards';
import { ProjectBoardContext } from './ProjectBoardContext';
import { useGetProjects } from '../features/projects/useGetProjects';
import { useGetBoardsByProjectId } from '../features/boards/useGetBoardsByProjectId';

type ProjectBoardProviderProps = { children: React.ReactNode };

export function ProjectBoardProvider({ children }: ProjectBoardProviderProps) {
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
  } = useGetProjects('main');

  const {
    boards,
    isLoading: isBoardLoading,
    error: boardError,
  } = useGetBoardsByProjectId(projectId);

  // Initialize projects once
  useEffect(() => {
    if (projects?.length && !project) {
      setProject(projects[0]);
    }
  }, [projects, project]);

  // Initialize boards once
  useEffect(() => {
    if (boards?.length && !board) {
      setBoard(boards[0]);
    }
  }, [board, boards, project]);

  //Reset board when project changes
  useEffect(() => {
    if (project && boards?.length) {
      const boardBelongsToProject = boards.some(
        (b: Boards) => b.projectId === project.id && b.id === board?.id
      );

      if (!boardBelongsToProject) {
        setBoard(boards[0]);
      }
    }
  }, [project, boards, board]);

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
