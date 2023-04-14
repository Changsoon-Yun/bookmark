export interface CreateBookmarkModalProps {
  initialRef?: React.MutableRefObject<null>;
  finalRef?: React.MutableRefObject<null>;
  isOpen: boolean;
  onClose: () => void;
  isCentered: boolean;
  isEdit?: boolean;
}