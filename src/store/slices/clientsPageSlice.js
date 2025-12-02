import { createSlice } from '@reduxjs/toolkit';
import {
  initialClientsFilterState,
  initialStatisticsFilterState,
} from '@utils/store/initialStates';

const loadState = () => {
  try {
    // Clear old statisticsPageState if it exists
    if (localStorage.getItem('statisticsPageState')) {
      localStorage.removeItem('statisticsPageState');
    }

    const serializedState = localStorage.getItem('clientsPageState');
    const parsedState = serializedState ? JSON.parse(serializedState) : {};
    return {
      clients: [],
      currentClient: parsedState.currentClient || {},
      filter: parsedState.filter || initialClientsFilterState,
      statisticsFilter:
        parsedState.statisticsFilter || initialStatisticsFilterState,
      currentPage: parsedState.currentPage || 0,
      pageSize: parsedState.pageSize || 10,
      lastAction: parsedState.lastAction || [],
    };
  } catch (error) {
    console.log('Error loading state', error);
    return {
      clients: [],
      currentClient: {},
      filter: initialClientsFilterState,
      statisticsFilter: initialStatisticsFilterState,
      currentPage: 0,
      pageSize: 10,
      lastAction: [],
    };
  }
};

const saveState = (state) => {
  try {
    const {
      filter,
      statisticsFilter,
      currentPage,
      pageSize,
      currentClient,
      lastAction,
    } = state;

    const serializedState = JSON.stringify({
      filter,
      statisticsFilter,
      currentPage,
      pageSize,
      currentClient,
      lastAction,
    });
    localStorage.setItem('clientsPageState', serializedState);
  } catch (error) {
    console.log('Error saving state', error);
  }
};

const initialState = loadState();
// Save the initial state to localStorage
saveState(initialState);

const clientsPageSlice = createSlice({
  name: 'clientsPage',
  initialState,
  reducers: {
    setClients(state, action) {
      state.clients = action.payload;
    },
    setCurrentClient(state, action) {
      state.currentClient = action.payload;
      saveState(state);
    },
    setClientsFilter(state, action) {
      const payload = {
        ...action.payload,
      };
      state.filter = payload;
      saveState(state);
    },
    setLastAction(state, action) {
      state.lastAction = action.payload;
      saveState(state);
    },
    setClientsCurrentPage(state, action) {
      state.currentPage = action.payload;
      saveState(state);
    },
    setClientsPageSize(state, action) {
      state.pageSize = action.payload;
      saveState(state);
    },
    setClientsStatisticsFilter(state, action) {
      state.statisticsFilter = { ...action.payload };
      saveState(state);
    },
  },
});

export const {
  setClients,
  setClientsFilter,
  setClientsCurrentPage,
  setClientsPageSize,
  setClientsStatisticsFilter,
  setCurrentClient,
  setLastAction,
} = clientsPageSlice.actions;
export default clientsPageSlice.reducer;
