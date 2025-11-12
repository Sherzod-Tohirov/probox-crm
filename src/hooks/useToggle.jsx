import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toggleMessenger, toggleSidebar } from '../store/slices/toggleSlice';

const useToggle = (toggleName) => {
  const dispatch = useDispatch();
  const toggleState = useSelector((state) => state.toggle);

  // Create stable toggle functions with useCallback
  const toggleSidebarFunc = useCallback(() => {
    dispatch(toggleSidebar());
  }, [dispatch]);

  const toggleMessengerFunc = useCallback(() => {
    dispatch(toggleMessenger());
  }, [dispatch]);

  const toggleFuncMap = {
    sidebar: toggleSidebarFunc,
    messenger: toggleMessengerFunc,
  };

  if (Array.isArray(toggleName)) {
    const toggleStates = {};
    toggleName.forEach((name) => {
      const nameUpper = name[0].toUpperCase() + name.slice(1);
      toggleStates[name] = {
        isOpen: toggleState['is' + nameUpper + 'Open'],
        toggle: toggleFuncMap[name],
      };
    });
    return toggleStates;
  }

  const nameUpper = toggleName[0].toUpperCase() + toggleName.slice(1);
  return {
    isOpen: toggleState['is' + nameUpper + 'Open'],
    toggle: toggleFuncMap[toggleName],
  };
};

export default useToggle;
