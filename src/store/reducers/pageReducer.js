import { combineReducers } from "@reduxjs/toolkit";
import clientPageReducer from "../slices/clientsPageSlice";
import statisticsPageReducer from "../slices/statisticsPageSlice";

export const pageReducer = combineReducers({
  clients: clientPageReducer,
  statistics: statisticsPageReducer,
});
