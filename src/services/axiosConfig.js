import axios from 'axios';
import { store } from '@store/store.js';
import { logoutUser } from '@store/slices/authSlice.js';
import { alert } from '../utils/globalAlert';
const baseURL = import.meta.env.VITE_API_URL || 'http://83.69.136.98:3019/api';
const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(function (config) {
  const token = store.getState().auth.token;
  config.headers.Authorization = token ? `${token}` : null;
  return config;
});

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    alert(error?.response?.data?.message || 'Server bilan xatolik yuz berdi!', {
      type: 'error',
    });
    if (error.response?.status === 401) {
      store.dispatch(logoutUser());
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
