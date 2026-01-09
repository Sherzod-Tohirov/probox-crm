import { combineReducers } from '@reduxjs/toolkit';
import clientPageReducer from '../slices/clientsPageSlice';
import leadsPageReducer from '../slices/leadsPageSlice';
import productsPageReducer from '../slices/productsPageSlice';

export const pageReducer = combineReducers({
  clients: clientPageReducer,
  leads: leadsPageReducer,
  products: productsPageReducer,
});
