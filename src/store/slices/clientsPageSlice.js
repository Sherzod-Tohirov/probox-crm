import { createSlice } from "@reduxjs/toolkit";
import moment from "moment";

const loadState = () => {
  const today = moment().startOf("month").toISOString();
  const endOfMonth = moment().endOf("month").toISOString();
  const initialFilter = {
    query: "",
    phone: "998",
    startDate: today,
    endDate: endOfMonth,
    status: "all",
    executor: "",
  };

  try {
    const serializedState = localStorage.getItem("clientsPageState");
    const parsedState = serializedState ? JSON.parse(serializedState) : {};
    return {
      clients: [],
      filter: parsedState.filter || initialFilter,
      currentPage: parsedState.currentPage || 1,
      pageSize: parsedState.pageSize || 10,
    };
  } catch (error) {
    console.log("Error loading state", error);
    return {
      clients: [],
      filter: initialFilter,
      currentPage: 1,
      pageSize: 10,
    };
  }
};

const saveState = (state) => {
  console.log(state, "state");
  try {
    const { filter, currentPage, pageSize } = state;
    console.log("state page size: ", pageSize);
    const serializedState = JSON.stringify({ filter, currentPage, pageSize });
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
    setClientsFilter(state, action) {
      state.filter = action.payload;
      saveState(state);
    },
    setClientsCurrentPage(state, action) {
      state.currentPage = action.payload;
      saveState(state);
    },
    setClientsPageSize(state, action) {
      console.log(action, "action");
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
} = clientsPageSlice.actions;
export default clientsPageSlice.reducer;
