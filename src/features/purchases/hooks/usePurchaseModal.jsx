import { useState } from 'react';

export function usePurchaseModal() {
  const [modal, setModal] = useState(null);
  const openModal = (type, row) => {
    setModal({ type, payload: row });
  };

  const closeModal = () => {
    setModal(null);
  };
  return { modal, openModal, closeModal };
}
