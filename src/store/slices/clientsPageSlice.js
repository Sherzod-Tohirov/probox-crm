import { createSlice } from "@reduxjs/toolkit";
import moment from "moment";

const loadState = () => {
  const today = moment().startOf("month").format("DD.MM.YYYY");
  const endOfMonth = moment().endOf("month").format("DD.MM.YYYY");
  const initialFilter = {
    search: "",
    phone: "998",
    startDate: today,
    endDate: endOfMonth,
    paymentStatus: "all",
    slpCode: "",
  };

  try {
    const serializedState = localStorage.getItem("clientsPageState");
    const parsedState = serializedState ? JSON.parse(serializedState) : {};
    return {
      clients: [],
      currentClient: parsedState.currentClient || {},
      filter: parsedState.filter || initialFilter,
      currentPage: parsedState.currentPage || 1,
      pageSize: parsedState.pageSize || 10,
    };
  } catch (error) {
    console.log("Error loading state", error);
    return {
      clients: [],
      currentClient: {},
      filter: initialFilter,
      currentPage: 1,
      pageSize: 10,
    };
  }
};

const saveState = (state) => {
  console.log(state, "state");
  try {
    const { filter, currentPage, pageSize, currentClient } = state;
    console.log("state page size: ", pageSize);
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
      const payload = { ...action.payload };

      // Helper to convert to "DD.MM.YYYY" if needed
      const formatToSafeDate = (value) => {
        const m = moment(value, "DD.MM.YYYY", true);
        if (m.isValid()) return value; // Already in correct format
        return moment(value).format("DD.MM.YYYY"); // Convert from Date, ISO, etc.
      };

      if (payload.startDate) {
        payload.startDate = formatToSafeDate(payload.startDate);
      }

      if (payload.endDate) {
        payload.endDate = formatToSafeDate(payload.endDate);
      }

      console.log(payload, "Filtered payload for Redux");
      state.filter = payload;
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
  setCurrentClient,
} = clientsPageSlice.actions;
export default clientsPageSlice.reducer;
