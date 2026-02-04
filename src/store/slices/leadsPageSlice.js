import { createSlice } from '@reduxjs/toolkit';
import moment from 'moment';
import { initialLeadsFilterState } from '@/store/utils/initialStates';

const loadState = () => {
  try {
    const serializedState = localStorage.getItem('leadsPageState');
    const parsedState = serializedState ? JSON.parse(serializedState) : {};
    const rawFilter = parsedState.filter ?? initialLeadsFilterState;
    const mVal =
      typeof rawFilter?.meeting === 'object'
        ? rawFilter.meeting?.value
        : rawFilter?.meeting;
    const sanitizedFilter = {
      ...rawFilter,
      ...(mVal === '' || mVal === undefined || mVal === null
        ? { meetingDateStart: '', meetingDateEnd: '' }
        : {}),
    };
    const storedPage = Number.parseInt(parsedState.currentPage, 10);
    const normalizedPage =
      Number.isNaN(storedPage) || storedPage < 0 ? 0 : storedPage;
    const storedPageSize = Number.parseInt(parsedState.pageSize, 10);
    const normalizedPageSize = Number.isNaN(storedPageSize)
      ? 10
      : Math.max(storedPageSize, 1);

    const defaultStatisticsFilter = {
      startDate: moment().subtract(6, 'days').format('DD.MM.YYYY'),
      endDate: moment().format('DD.MM.YYYY'),
    };

    return {
      leads: [],
      currentLead: parsedState.currentLead ?? {},
      filter: sanitizedFilter,
      statisticsFilter: parsedState.statisticsFilter ?? defaultStatisticsFilter,
      currentPage: normalizedPage,
      pageSize: normalizedPageSize,
      lastAction: parsedState.lastAction ?? [],
    };
  } catch (error) {
    console.log('Error loading leads page state', error);
    const defaultStatisticsFilter = {
      startDate: moment().subtract(6, 'days').format('DD.MM.YYYY'),
      endDate: moment().format('DD.MM.YYYY'),
    };

    return {
      leads: [],
      currentLead: {},
      filter: initialLeadsFilterState,
      statisticsFilter: defaultStatisticsFilter,
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
      currentLead,
      lastAction,
    } = state;
    const serializedState = JSON.stringify({
      filter,
      statisticsFilter,
      currentPage,
      pageSize,
      currentLead,
      lastAction,
    });
    localStorage.setItem('leadsPageState', serializedState);
  } catch (error) {
    console.log('Error saving leads page state', error);
  }
};

// const clearPersistedState = () => {
//   try {
//     localStorage.removeItem('leadsPageState');
//   } catch (error) {
//     console.log('Error clearing leads page state', error);
//   }
// };

const initialState = loadState();
// Save initial state
saveState(initialState);

const leadsPageSlice = createSlice({
  name: 'leadsPage',
  initialState,
  reducers: {
    setLeads(state, action) {
      state.leads = action.payload;
    },
    setCurrentLead(state, action) {
      state.currentLead = action.payload;
      saveState(state);
    },
    setLeadsFilter(state, action) {
      state.filter = { ...action.payload };
      saveState(state);
    },
    setLeadsCurrentPage(state, action) {
      state.currentPage = action.payload;
      saveState(state);
    },
    setLeadsPageSize(state, action) {
      state.pageSize = action.payload;
      saveState(state);
    },
    setLeadsLastAction(state, action) {
      state.lastAction = action.payload;
      saveState(state);
    },
    setLeadsStatisticsFilter(state, action) {
      state.statisticsFilter = { ...action.payload };
      saveState(state);
    },
    resetLeadsPage(state) {
      state.leads = [];
      state.currentLead = {};
      state.filter = {
        ...initialLeadsFilterState,
        source: [],
        branch: [],
        operator: [],
        operator2: [],
        seller: [],
        scoring: [],
      };
      state.currentPage = 0;
      state.pageSize = state.pageSize || 10;
      state.lastAction = [];
      saveState(state);
    },
  },
});

export const {
  setLeads,
  setLeadsFilter,
  setLeadsCurrentPage,
  setLeadsPageSize,
  setLeadsLastAction,
  setLeadsStatisticsFilter,
  setCurrentLead,
  resetLeadsPage,
} = leadsPageSlice.actions;

export default leadsPageSlice.reducer;
