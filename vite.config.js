import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// https://vite.dev/config/

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();

export default defineConfig({
  build: {
    rollupOptions: {
      external: [
        'haversine-distance',
        'wavesurfer.js',
        'lucide-react',
        '@floating-ui/react',
        '@floating-ui/react-dom',
        'framer-motion',
        'moment',
        'lodash',
        'react-hook-form',
        '@hookform/resolvers/yup',
        'yup',
        'react-redux',
        '@reduxjs/toolkit',
        'classnames',
        // Add chart libraries if you use them
        'chart.js',
        'react-chartjs-2',
        // Add table libraries if you use them
        'react-table',
        '@tanstack/react-table',
        // Add date libraries
        'date-fns',
        // Add form libraries
        'formik',
        // Add animation libraries
        'react-spring',
        'react-transition-group',
      ],
    },
  },
  plugins: [react()],
  base: '/',
  server: {
    port: process.env.PORT || 3000,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@components': path.resolve(__dirname, 'src/components'),
      '@pages': path.resolve(__dirname, 'src/pages'),
      '@hooks': path.resolve(__dirname, 'src/hooks'),
      '@layouts': path.resolve(__dirname, 'src/layouts'),
      '@utils': path.resolve(__dirname, 'src/utils'),
      '@services': path.resolve(__dirname, 'src/services'),
      '@features': path.resolve(__dirname, 'src/features'),
      '@store': path.resolve(__dirname, 'src/store'),
      '@assets': path.resolve(__dirname, 'src/assets'),
      '@config': path.resolve(__dirname, 'src/config'),
      '@styles': path.resolve(__dirname, 'src/assets/styles'),
    },
  },
});
