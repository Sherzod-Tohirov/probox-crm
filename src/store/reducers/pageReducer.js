import { combineReducers } from "@reduxjs/toolkit";
import clientPageReducer from "../slices/clientsPageSlice";

export const pageReducer = combineReducers({
  clients: clientPageReducer,
});
