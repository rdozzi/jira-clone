import { Dispatch, SetStateAction, createContext } from 'react';
import { BoardRef, ProjectRef } from '../types/projectBoard';
import { Projects } from '../types/Projects';
import { Boards } from '../types/Boards';

type ProjectBoardContextType = {
  // Projects list
  projects: Projects[];
  isProjectLoading: boolean;
  projectError: Error | null;

  // Boards list
  boards: Boards[];
  isBoardLoading: boolean;
  boardError: Error | null;

  // Currently Selected Refs
  project: ProjectRef | null;
  setProject: Dispatch<SetStateAction<ProjectRef | null>>;

  board: BoardRef | null;
  setBoard: Dispatch<SetStateAction<BoardRef | null>>;

  //Derived Id for Queries
  projectId: number | null;
  boardId: number | null;

  //Utility
  clear: () => void;
};

export const ProjectBoardContext = createContext<
  ProjectBoardContextType | undefined
>(undefined);
