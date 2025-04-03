import axios from "axios";
import { store } from "@store/store.js";
import { logoutUser } from "@store/slices/authSlice.js";
const baseURL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const api = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(function (config) {
  const token = store.getState().auth.token;
  config.headers.Authorization = token ? `${token}` : null;
  return config;
});

api.interceptors.response.use(
  (response) => {
    console.log("interceptor", response);
    return response;
  },
  (error) => {
    console.log("interceptor error", error);
    console.log(error.response?.status === 401, "401 error");
    if (error.response?.status === 401) {
      store.dispatch(logoutUser());
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;
