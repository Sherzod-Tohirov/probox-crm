import { createSlice } from '@reduxjs/toolkit';
import moment from 'moment';

const STORAGE_KEY = 'newStatisticsState';

const buildDefaultFilter = () => {
  const today = moment();
  const startOfDay = today.clone().startOf('day').format('DD.MM.YYYY');
  const endOfDay = today.clone().endOf('day').format('DD.MM.YYYY');
  return {
    selectedOption: 'today',
    dateRange: [startOfDay, endOfDay],
  };
};

const loadState = () => {
  try {
    const serializedState = localStorage.getItem(STORAGE_KEY);
    const parsedState = serializedState ? JSON.parse(serializedState) : {};
    const fallback = buildDefaultFilter();

    const selectedOption = parsedState?.selectedOption ?? fallback.selectedOption;
    const dateRange = Array.isArray(parsedState?.dateRange)
      ? parsedState.dateRange
      : fallback.dateRange;

    return {
      selectedOption,
      dateRange,
    };
  } catch (error) {
    console.log('Error loading new statistics state', error);
    return buildDefaultFilter();
  }
};

const saveState = (state) => {
  try {
    const serializedState = JSON.stringify({
      selectedOption: state.selectedOption,
      dateRange: state.dateRange,
    });
    localStorage.setItem(STORAGE_KEY, serializedState);
  } catch (error) {
    console.log('Error saving new statistics state', error);
  }
};

const initialState = loadState();
saveState(initialState);

const newStatisticsSlice = createSlice({
  name: 'newStatistics',
  initialState,
  reducers: {
    setNewStatisticsFilter(state, action) {
      const next = action.payload || {};
      state.selectedOption =
        next.selectedOption !== undefined ? next.selectedOption : state.selectedOption;
      state.dateRange = Array.isArray(next.dateRange) ? next.dateRange : state.dateRange;
      saveState(state);
    },
    resetNewStatisticsFilter(state) {
      const fallback = buildDefaultFilter();
      state.selectedOption = fallback.selectedOption;
      state.dateRange = fallback.dateRange;
      saveState(state);
    },
  },
});

export const { setNewStatisticsFilter, resetNewStatisticsFilter } =
  newStatisticsSlice.actions;

export default newStatisticsSlice.reducer;
