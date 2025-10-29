import { createSlice } from '@reduxjs/toolkit';
import { initialLeadsFilterState } from '@utils/store/initialStates';

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
    return {
      leads: [],
      currentLead: parsedState.currentLead ?? {},
      filter: sanitizedFilter,
      currentPage: parsedState.currentPage ?? 1,
      pageSize: parsedState.pageSize ?? 10,
      lastAction: parsedState.lastAction ?? [],
    };
  } catch (error) {
    console.log('Error loading leads page state', error);
    return {
      leads: [],
      currentLead: {},
      filter: initialLeadsFilterState,
      currentPage: 1,
      pageSize: 10,
      lastAction: [],
    };
  }
};

const saveState = (state) => {
  try {
    const { filter, currentPage, pageSize, currentLead, lastAction } = state;
    const serializedState = JSON.stringify({
      filter,
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
  },
});

export const {
  setLeads,
  setLeadsFilter,
  setLeadsCurrentPage,
  setLeadsPageSize,
  setLeadsLastAction,
  setCurrentLead,
} = leadsPageSlice.actions;

export default leadsPageSlice.reducer;
