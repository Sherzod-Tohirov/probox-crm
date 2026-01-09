import { createSlice } from '@reduxjs/toolkit';
import { initialLeadsFilterState } from '@utils/store/initialStates';

const loadState = () => {
  try {
    const serializedState = localStorage.getItem('productsPageState');
    const parsedState = serializedState ? JSON.parse(serializedState) : {};
    const storedPage = Number.parseInt(parsedState.currentPage, 10);
    const normalizedPage =
      Number.isNaN(storedPage) || storedPage < 0 ? 0 : storedPage;
    const storedPageSize = Number.parseInt(parsedState.pageSize, 10);
    const normalizedPageSize = Number.isNaN(storedPageSize)
      ? 10
      : Math.max(storedPageSize, 1);

    return {
      filter: parsedState.filter || initialLeadsFilterState,
      currentPage: normalizedPage,
      pageSize: normalizedPageSize,
    };
  } catch (error) {
    console.log('Error loading products page state', error);

    return {
      filter: initialLeadsFilterState,
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
