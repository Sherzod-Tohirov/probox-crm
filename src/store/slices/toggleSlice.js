import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isSidebarOpen: true,
  isMessengerOpen: false,
};

const toggleSlice = createSlice({
  name: "toggle",
  initialState,
  reducers: {
    toggleSidebar(state) {
      state.isSidebarOpen = !state.isSidebarOpen;
    },
    toggleMessenger(state) {
      state.isMessengerOpen = !state.isMessengerOpen;
    },
  },
});

export const { toggleSidebar, toggleMessenger } = toggleSlice.actions;

export default toggleSlice.reducer;
