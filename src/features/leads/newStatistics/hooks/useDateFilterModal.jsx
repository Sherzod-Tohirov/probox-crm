import { useState } from 'react';

export default function useDateFilterModal() {
  const [isOpen, setIsOpen] = useState(false);
  const onClose = () => setIsOpen(false);
  const onOpen = () => setIsOpen(true);
  const onApply = () => setIsOpen(false);
  return {
    isOpen,
    onClose,
    onApply,
    onOpen,
  };
}
