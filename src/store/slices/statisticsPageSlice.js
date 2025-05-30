import { createSlice } from "@reduxjs/toolkit";
import { initialStatisticsFilterState } from "@utils/store/initialStates";

const loadState = () => {
  try {
    const serializedState = localStorage.getItem("statisticsPageState");
    const parsedState = serializedState ? JSON.parse(serializedState) : {};
    return {
      filter: parsedState.filter || initialStatisticsFilterState,
    };
  } catch (error) {
    console.log("Error loading state", error);
    return {
      filter: initialStatisticsFilterState,
    };
  }
};

const saveState = (state) => {
  try {
    const { filter } = state;

    const serializedState = JSON.stringify({
      filter,
    });
    localStorage.setItem("statisticsPageState", serializedState);
  } catch (error) {
    console.log("Error saving state", error);
  }
};

const initialState = loadState();

// Save the initial state to localStorage
saveState(initialState);

const statisticsPageSlice = createSlice({
  name: "statisticsPage",
  initialState,
  reducers: {
    setStatisticsFilter(state, action) {
      const payload = {
        ...action.payload,
      };
      state.filter = payload;
      saveState(state);
    },
  },
});

export const { setStatisticsFilter } = statisticsPageSlice.actions;
export default statisticsPageSlice.reducer;
