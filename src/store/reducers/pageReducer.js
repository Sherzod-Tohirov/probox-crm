import { combineReducers } from '@reduxjs/toolkit';
import clientPageReducer from '../slices/clientsPageSlice';
import leadsPageReducer from '../slices/leadsPageSlice';

export const pageReducer = combineReducers({
  clients: clientPageReducer,
  leads: leadsPageReducer,
});
