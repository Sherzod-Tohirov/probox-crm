import { createSlice } from '@reduxjs/toolkit';
import { initialPurchasesFilterState } from '../utils/initialStates';
import normalizePageAndSize from '../utils/normalizePageAndSize';

const loadState = () => {
  try {
    const serializedState = localStorage.getItem('purchasesPageState');
    const parsedState = serializedState ? JSON.parse(serializedState) : {};
    const { normalizedPageSize, normalizedPage } = normalizePageAndSize({
      page: parsedState.currentPage,
      size: parsedState.pageSize,
    });
    return {
      filter: { ...(parsedState.filter ?? initialPurchasesFilterState) },
      currentPage: normalizedPage,
      pageSize: normalizedPageSize,
    };
  } catch (error) {
    console.log('Error loading purchases page state', error);
    console.log('This is catch block');
    return {
      filter: initialPurchasesFilterState,
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
    localStorage.setItem('purchasesPageState', serializedState);
  } catch (error) {
    console.log('Error saving purchases page state', error);
  }
};

const initialState = loadState();

saveState(initialState);

const purchasesPageSlice = createSlice({
  name: 'purchasesPage',
  initialState,
  reducers: {
    setPurchasesCurrentPage: (state, action) => {
      state.currentPage = action.payload;
      saveState(state);
    },
    setPurchasesPageSize: (state, action) => {
      state.pageSize = action.payload;
      state.currentPage = 0; // Reset to first page when page size changes
      saveState(state);
    },
    setPurchasesFilter: (state, action) => {
      state.filter = action.payload;
      state.currentPage = 0; // Reset to first page when filter changes
      saveState(state);
    },
    resetPurchasesPage: (state) => {
      state.currentPage = 0;
      state.pageSize = 20;
      state.filter = initialPurchasesFilterState;
      saveState(state);
    },
  },
});

export const {
  setPurchasesCurrentPage,
  setPurchasesPageSize,
  setPurchasesFilter,
  resetPurchasesPage,
} = purchasesPageSlice.actions;

export default purchasesPageSlice.reducer;
