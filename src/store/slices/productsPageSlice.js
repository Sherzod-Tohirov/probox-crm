import { createSlice } from '@reduxjs/toolkit';
import { initialProductsFilterState } from '@/store/utils/initialStates';

import normalizePageAndSize from '../utils/normalizePageAndSize';

const loadState = () => {
  try {
    const serializedState = localStorage.getItem('productsPageState');
    const parsedState = serializedState ? JSON.parse(serializedState) : {};
    const { normalizedPageSize, normalizedPage } = normalizePageAndSize({
      page: parsedState.currentPage,
      size: parsedState.pageSize,
    });
    console.log(parsedState, 'parsed state');
    return {
      filter: { ...(parsedState.filter ?? initialProductsFilterState) },
      currentPage: normalizedPage,
      pageSize: normalizedPageSize,
    };
  } catch (error) {
    console.log('Error loading products page state', error);
    console.log('This is catch block');
    return {
      filter: initialProductsFilterState,
      currentPage: 0,
      pageSize: 10,
    };
  }
};

const saveState = (state) => {
  try {
    const { filter, currentPage, pageSize } = state;
    const serializedState = JSON.stringify({
      filter,
      currentPage,
      pageSize,
    });
    localStorage.setItem('productsPageState', serializedState);
  } catch (error) {
    console.log('Error saving products page state', error);
  }
};

const initialState = loadState();
console.log(initialState, 'initial state');
// Save initial state
saveState(initialState);

const productsPageSlice = createSlice({
  name: 'productsPage',
  initialState,
  reducers: {
    setProductsFilter(state, action) {
      state.filter = { ...action.payload };
      saveState(state);
    },
    setProductsCurrentPage(state, action) {
      state.currentPage = action.payload;
      saveState(state);
    },
    setProductsPageSize(state, action) {
      state.pageSize = action.payload;
      saveState(state);
    },
  },
});

export const {
  setProductsFilter,
  setProductsPageSize,
  setProductsCurrentPage,
} = productsPageSlice.actions;

export default productsPageSlice.reducer;
