import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  isSidebarOpen: true,
  isMessengerOpen: false,
  modals: {}, // modalId => true, or false to toggle modal
};

const loadState = () => {
  try {
    const serializedState = localStorage.getItem("toggleState");
    if (serializedState === null) {
      return initialState;
    }
    return JSON.parse(serializedState);
  } catch (error) {
    console.log(error);
  }
};

const deleteModals = (state, action, isAll = false) => {
  Object.entries(state.modals).forEach(([modalId, _]) => {
    if (isAll) {
      delete state.modals[modalId];
      return;
    }

    if (modalId !== action.payload) {
      delete state.modals[modalId];
    }
  });
};

const saveState = (state) => {
  localStorage.setItem("toggleState", JSON.stringify(state));
};

const toggleSlice = createSlice({
  name: "toggle",
  initialState: loadState(),
  reducers: {
    toggleSidebar(state) {
      state.isSidebarOpen = !state.isSidebarOpen;
      saveState(state);
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
