import { configureStore } from "@reduxjs/toolkit";
import toggleReducer from "./slices/toggleSlice";
import authReducer from "./slices/authSlice";
import { pageReducer } from "./reducers/pageReducer";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    page: pageReducer,
    toggle: toggleReducer,
  },
});
