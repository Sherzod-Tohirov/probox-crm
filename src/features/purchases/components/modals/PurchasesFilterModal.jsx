import { Modal } from '@/components/ui';

export function PurchasesFilterModal({ open, onClose, title }) {
  return <Modal open={open} onClose={onClose} title={title}></Modal>;
}
