import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isSidebarOpen: true,
  isMessengerOpen: false,
  modals: {}, // modalId => true, or false to toggle modal
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
    toggleModal(state, action) {
      state.modals[action.payload] = !state.modals?.[action.payload];
      Object.entries(state.modals).forEach(([modalId, _]) => {
        if (modalId !== action.payload) {
          delete state.modals[modalId];
        }
      });
    },
  },
});

export const { toggleSidebar, toggleMessenger, toggleModal } =
  toggleSlice.actions;

export default toggleSlice.reducer;
