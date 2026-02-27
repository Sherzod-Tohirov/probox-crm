import { createSlice } from '@reduxjs/toolkit';

const getInitialTheme = () => {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
    return savedTheme;
  }
  return 'auto'; // Default to auto mode
};

const applyTheme = (theme) => {
  const root = document.documentElement;

  if (theme === 'auto') {
    const prefersDark = window.matchMedia(
      '(prefers-color-scheme: dark)'
    ).matches;
    root.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
  } else {
    root.setAttribute('data-theme', theme);
  }
};

const initialState = {
  mode: getInitialTheme(), // 'light' | 'dark' | 'auto'
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setTheme: (state, action) => {
      state.mode = action.payload;
      localStorage.setItem('theme', action.payload);
      applyTheme(action.payload);
    },
    initializeTheme: (state) => {
      applyTheme(state.mode);
    },
  },
});

export const { setTheme, initializeTheme } = themeSlice.actions;
export default themeSlice.reducer;
