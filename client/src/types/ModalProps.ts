export interface ModalProps<TRecord = unknown> {
  isOpen: boolean;
  closeModal: () => void;
  record?: TRecord;
  mode: 'create' | 'viewEdit' | null;
}
