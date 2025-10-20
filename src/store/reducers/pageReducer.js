import { combineReducers } from "@reduxjs/toolkit";
import clientPageReducer from "../slices/clientsPageSlice";
import statisticsPageReducer from "../slices/statisticsPageSlice";
import leadsPageReducer from "../slices/leadsPageSlice";

export const pageReducer = combineReducers({
  clients: clientPageReducer,
  statistics: statisticsPageReducer,
  leads: leadsPageReducer,
});
