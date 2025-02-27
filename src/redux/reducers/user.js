import { createSlice } from "@reduxjs/toolkit";

// initial state
const initialState = {
  signedIn: false,
  token: "",
  user: {
    id: 0,
    name: "",
    email: "",
    password: "",
    token: "",
    roleId: 0,
    institutionId: 0,
    createdAt: "",
    updatedAt: "",
  },
};

// ==============================|| SLICE - MENU ||============================== //

const user = createSlice({
  name: "user",
  initialState,
  reducers: {
    loginUser(state, action) {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.signedIn = true;
    },
    logoutUser(state) {
      state.userDetails = initialState.userDetails;
      state.token = initialState.token;
      state.signedIn = initialState.signedIn;
    },
  },
});

export default user.reducer;

export const { loginUser, logoutUser } = user.actions;
