import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isSidebarOpen: true,
  isMessengerOpen: false,
  modals: {}, // modalId => true, or false to toggle modal
};

function deleteModals(state, action, isAll = false) {
  Object.entries(state.modals).forEach(([modalId, _]) => {
    if (isAll) {
      delete state.modals[modalId];
      return;
    }

    if (modalId !== action.payload) {
      delete state.modals[modalId];
    }
  });
}

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
      deleteModals(state, action);
    },
    closeAllModals(state, action) {
      deleteModals(state, action, true);
    },
  },
});

export const { toggleSidebar, toggleMessenger, toggleModal, closeAllModals } =
  toggleSlice.actions;

export default toggleSlice.reducer;
