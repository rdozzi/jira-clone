import { createContext } from 'react';
// import { BoardRef, ProjectRef } from '../types/projectBoard';
import { Projects } from '../types/Projects';
import { Boards } from '../types/Boards';

type ProjectBoardContextType = {
  projects: Projects[];
  isProjectLoading: boolean;
  projectError: Error | null;
  boards: Boards[];
  isBoardLoading: boolean;
  boardError: Error | null;
  // board: BoardRef | null;
  // setProject: Dispatch<SetStateAction<ProjectRef | null>>;
  // setBoard: Dispatch<SetStateAction<BoardRef | null>>;
  // clear: () => void;
};

export const ProjectBoardContext = createContext<
  ProjectBoardContextType | undefined
>(undefined);
