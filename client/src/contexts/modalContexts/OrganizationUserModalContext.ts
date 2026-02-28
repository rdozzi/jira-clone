import { createContext } from 'react';
import { OrganizationUser } from '../../types/Users';

type OrganizationUserModalProps = {
  record?: OrganizationUser;
};

type OrganizationUserModalContextType<
  TProps extends OrganizationUserModalProps = object,
> = {
  isOpen: boolean;
  openModal: (_modalProps: object) => void;
  closeModal: () => void;
  modalProps: TProps;
};

export const OrganizationUseModalContext =
  createContext<OrganizationUserModalContextType<OrganizationUserModalProps> | null>(
    null,
  );
