export default function useEnv() {
  const appEnv = import.meta.env.VITE_APP_ENV || 'development';
  const isDev = appEnv === 'development';
  const isProd = appEnv === 'production';

  return {
    isDev,
    isProd,
  };
}
