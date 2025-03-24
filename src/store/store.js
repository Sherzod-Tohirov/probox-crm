import { configureStore } from "@reduxjs/toolkit";
import toggleReducer from "./slices/toggleSlice";
import { pageReducer } from "./reducers/pageReducer";
export const store = configureStore({
  reducer: {
    toggle: toggleReducer,
    page: pageReducer,
  },
});
