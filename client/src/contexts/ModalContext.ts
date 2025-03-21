import { createContext } from 'react';

type ModalContextType = {
  isOpen: boolean;
  openModal: (_mode: 'create' | 'viewEdit', _modalProps: object) => void;
  closeModal: () => void;
  mode: 'create' | 'viewEdit' | null;
  modalProps: Record<string, unknown>;
};

export const ModalContext = createContext<ModalContextType | null>({
  isOpen: false,
  openModal: () => {},
  closeModal: () => {},
  mode: null,
  modalProps: {},
});
