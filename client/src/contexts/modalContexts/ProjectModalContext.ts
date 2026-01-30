import { createContext } from 'react';
import { Project } from '../../types/Projects';

type ProjectModalProps = {
  record?: Project;
};

type ProjectModalContextType<TProps extends ProjectModalProps = object> = {
  isOpen: boolean;
  openModal: (_mode: 'create' | 'viewEdit', _modalProps: object) => void;
  closeModal: () => void;
  mode: 'create' | 'viewEdit' | null;
  modalProps: TProps;
};

export const ProjectModalContext =
  createContext<ProjectModalContextType<ProjectModalProps> | null>(null);
