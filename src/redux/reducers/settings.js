import { createSlice } from "@reduxjs/toolkit";

// initial state
const initialState = {
  loading: false,
};

// ==============================|| SLICE - MENU ||============================== //

const settings = createSlice({
  name: "settings",
  initialState,
  reducers: {
    setLoading(state, action) {
      state.loading = action.payload;
    },
  },
});

export default settings.reducer;

export const { setLoading } = settings.actions;
