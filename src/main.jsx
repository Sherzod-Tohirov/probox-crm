import '@assets/styles/globals.scss';
import './index.scss';
import router from './routes.jsx';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store/store.js';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const client = new QueryClient();

// Apply theme BEFORE React renders to prevent white flash
const initializeThemeImmediately = () => {
  const savedTheme = localStorage.getItem('theme') || 'auto';
  const root = document.documentElement;

  if (savedTheme === 'auto') {
    const prefersDark = window.matchMedia(
      '(prefers-color-scheme: dark)'
    ).matches;
    root.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
  } else {
    root.setAttribute('data-theme', savedTheme);
  }
};

// Initialize theme immediately
initializeThemeImmediately();

// Remove preload class after app mounts to enable transitions
setTimeout(() => {
  document.documentElement.classList.remove('preload');
}, 100);

createRoot(document.getElementById('root')).render(
  <>
    <QueryClientProvider client={client}>
      <Provider store={store}>
        <RouterProvider router={router} />
      </Provider>
    </QueryClientProvider>
  </>
);
