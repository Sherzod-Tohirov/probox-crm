import { createSlice } from "@reduxjs/toolkit";
import { initialClientsFilterState } from "@utils/store/initialClientsFilterState";

const loadState = () => {
  try {
    const serializedState = localStorage.getItem("clientsPageState");
    const parsedState = serializedState ? JSON.parse(serializedState) : {};
    return {
      clients: [],
      currentClient: parsedState.currentClient || {},
      filter: parsedState.filter || initialClientsFilterState,
      currentPage: parsedState.currentPage || 0,
      pageSize: parsedState.pageSize || 10,
    };
  } catch (error) {
    console.log("Error loading state", error);
    return {
      clients: [],
      currentClient: {},
      filter: initialFilter,
      currentPage: 0,
      pageSize: 10,
    };
  }
};

const saveState = (state) => {
  try {
    const { filter, currentPage, pageSize, currentClient } = state;
    const serializedState = JSON.stringify({
      filter,
      currentPage,
      pageSize,
      currentClient,
    });
    localStorage.setItem("clientsPageState", serializedState);
  } catch (error) {
    console.log("Error saving state", error);
  }
};

const initialState = loadState();

// Save the initial state to localStorage
saveState(initialState);

const clientsPageSlice = createSlice({
  name: "clientsPage",
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
    setClientsCurrentPage(state, action) {
      state.currentPage = action.payload;
      saveState(state);
    },
    setClientsPageSize(state, action) {
      state.pageSize = action.payload;
      saveState(state);
    },
  },
});

export const {
  setClients,
  setClientsFilter,
  setClientsCurrentPage,
  setClientsPageSize,
  setCurrentClient,
} = clientsPageSlice.actions;
export default clientsPageSlice.reducer;
