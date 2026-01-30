import { createContext } from 'react';
import { Board } from '../../types/Board';

type BoardModalProps = {
  record?: Board;
};

type BoardModalContextType<TProps extends BoardModalProps = object> = {
  isOpen: boolean;
  openModal: (_mode: 'create' | 'viewEdit', _modalProps: object) => void;
  closeModal: () => void;
  mode: 'create' | 'viewEdit' | null;
  modalProps: TProps;
};

export const BoardModalContext =
  createContext<BoardModalContextType<BoardModalProps> | null>(null);
