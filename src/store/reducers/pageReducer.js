import { combineReducers } from '@reduxjs/toolkit';
import clientPageReducer from '../slices/clientsPageSlice';
import leadsPageReducer from '../slices/leadsPageSlice';
import newStatisticsReducer from '../slices/newStatisticsSlice';
import productsPageReducer from '../slices/productsPageSlice';
import purchasesPageReducer from '../slices/purchasesPageSlice';

export const pageReducer = combineReducers({
  clients: clientPageReducer,
  leads: leadsPageReducer,
  newStatistics: newStatisticsReducer,
  products: productsPageReducer,
  purchases: purchasesPageReducer,
});
