import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: JSON.parse(localStorage.getItem("user")) || null,
  isAuthenticated: !!localStorage.getItem("user"),
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser(state, action) {
      state.user = action.payload;
      state.isAuthenticated = true;
      localStorage.setItem("user", JSON.stringify(action.payload));
    },
    logoutUser(state) {
      state.user = null;
      state.isAuthenticated = false;
      localStorage.removeItem("user");
    },
  },
});

export const { setUser, logoutUser } = authSlice.actions;
export default authSlice.reducer;
