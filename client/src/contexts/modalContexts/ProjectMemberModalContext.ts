import { createContext } from 'react';
import { ProjectMember } from '../../types/ProjectMember';

type ProjectMemberModalProps = {
  record?: ProjectMember;
  userId?: number;
};

type ProjectMemberModalContextType<
  TProps extends ProjectMemberModalProps = object,
> = {
  isOpen: boolean;
  openModal: (_mode: 'create' | 'viewEdit', _modalProps: object) => void;
  closeModal: () => void;
  mode: 'create' | 'viewEdit' | null;
  modalProps: TProps;
};

export const ProjectMemberModalContext =
  createContext<ProjectMemberModalContextType<ProjectMemberModalProps> | null>(
    null,
  );
