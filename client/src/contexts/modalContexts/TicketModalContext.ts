import { createContext } from 'react';
import { Ticket } from '../../types/Ticket';

type TicketModalProps = {
  record?: Ticket;
};

type TicketModalContextType<TProps extends TicketModalProps = object> = {
  isOpen: boolean;
  openModal: (_mode: 'create' | 'viewEdit', _modalProps: object) => void;
  closeModal: () => void;
  mode: 'create' | 'viewEdit' | null;
  modalProps: TProps;
};

export const TicketModalContext =
  createContext<TicketModalContextType<TicketModalProps> | null>(null);
