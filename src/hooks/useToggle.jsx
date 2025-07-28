import { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toggleMessenger, toggleSidebar } from '../store/slices/toggleSlice';

const useToggle = (toggleName) => {
  const dispatch = useDispatch();
  const toggleState = useSelector((state) => state.toggle);

  const toggleFuncMap = useMemo(
    () => ({
      sidebar: toggleSidebar,
      messenger: toggleMessenger,
    }),
    []
  );

  if (Array.isArray(toggleName)) {
    const toggleStates = {};
    toggleName.forEach((name) => {
      const nameUpper = name[0].toUpperCase() + name.slice(1);
      toggleStates[name] = {
        isOpen: toggleState['is' + nameUpper + 'Open'],
        toggle: () => dispatch(toggleFuncMap[name]()),
      };
    });
    return toggleStates;
  }

  const nameUpper = toggleName[0].toUpperCase() + toggleName.slice(1);
  return {
    isOpen: toggleState['is' + nameUpper + 'Open'],
    toggle: () => dispatch(toggleFuncMap[toggleName]()),
  };
};

export default useToggle;
