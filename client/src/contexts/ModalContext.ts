import { createContext } from 'react';
import { TicketModalPayload } from '../types/Tickets';

type ModalContextType<TProps = object> = {
  isOpen: boolean;
  openModal: (_mode: 'create' | 'viewEdit', _modalProps: object) => void;
  closeModal: () => void;
  mode: 'create' | 'viewEdit' | null;
  modalProps: TProps;
};

export const ModalContext =
  createContext<ModalContextType<TicketModalPayload> | null>({
    isOpen: false,
    openModal: () => {},
    closeModal: () => {},
    mode: null,
    modalProps: {},
  });
