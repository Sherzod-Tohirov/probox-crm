import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setTheme, initializeTheme } from '@store/slices/themeSlice';

export default function useTheme() {
  const dispatch = useDispatch();
  const mode = useSelector((state) => state.theme.mode);

  useEffect(() => {
    // Initialize theme on mount
    dispatch(initializeTheme());

    // Listen for system theme changes when in auto mode
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (mode === 'auto') {
        dispatch(initializeTheme());
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [mode, dispatch]);

  const changeTheme = (newTheme) => {
    dispatch(setTheme(newTheme));
  };

  const getCurrentTheme = () => {
    if (mode === 'auto') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';
    }
    return mode;
  };

  return {
    mode,
    currentTheme: getCurrentTheme(),
    changeTheme,
  };
}
