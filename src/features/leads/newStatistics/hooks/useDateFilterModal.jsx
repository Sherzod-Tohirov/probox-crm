import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setNewStatisticsFilter } from '@/store/slices/newStatisticsSlice';

export default function useDateFilterModal() {
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const onClose = () => setIsOpen(false);
  const onOpen = () => setIsOpen(true);
  const onApply = (payload) => {
    dispatch(setNewStatisticsFilter(payload));
    setIsOpen(false);
  };
  return {
    isOpen,
    onClose,
    onApply,
    onOpen,
  };
}
