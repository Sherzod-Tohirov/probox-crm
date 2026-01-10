import { createSlice } from '@reduxjs/toolkit';
import {
  initialProductModalFilterState,
  initialProductsFilterState,
} from '@/store/utils/initialStates';

import normalizePageAndSize from '../utils/normalizePageAndSize';

const loadState = () => {
  try {
    const serializedState = localStorage.getItem('productsPageState');
    const parsedState = serializedState ? JSON.parse(serializedState) : {};
    const { normalizedPageSize, normalizedPage } = normalizePageAndSize({
      page: parsedState.currentPage,
      size: parsedState.pageSize,
    });

    const {
      normalizedPageSize: modalNormalizedPageSize,
      normalizedPage: modalNormalizedPage,
    } = normalizePageAndSize({
      page: parsedState.productModal.currentPage,
      size: parsedState.productModal.pageSize,
    });

    return {
      filter: parsedState.filter || initialProductsFilterState,
      productModal: {
        ...parsedState.productModal,
        pageSize: modalNormalizedPageSize,
        currentPage: modalNormalizedPage,
      },
      currentPage: normalizedPage,
      pageSize: normalizedPageSize,
    };
  } catch (error) {
    console.log('Error loading products page state', error);

    return {
      filter: initialProductsFilterState,
      productModal: {
        currentPage: 0,
        filter: initialProductModalFilterState,
        pageSize: 10,
      },
      currentPage: 0,
      pageSize: 10,
    };
  }
};

const saveState = (state) => {
  try {
    const { filter, currentPage, pageSize, productModal } = state;
    const serializedState = JSON.stringify({
      filter,
      currentPage,
      pageSize,
      productModal,
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
    setProductModalCurrentPage(state, action) {
      state.productModal.currentPage = action.payload;
    },
    setProductModalPageSize(state, action) {
      state.productModal.pageSize = action.payload;
    },
    setProductsModalFilter(state, action) {
      state.productModal.filter = { ...action.filter };
    },
  },
});

export const {
  setProductsFilter,
  setProductsPageSize,
  setProductsCurrentPage,
  setProductModalCurrentPage,
  setProductModalPageSize,
  setProductsModalFilter,
} = productsPageSlice.actions;

export default productsPageSlice.reducer;
