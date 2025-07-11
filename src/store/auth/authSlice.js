import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  token: null,
  tokenExpireAt: null,
  user: null,
  companyDetails: null,
  companyImage: null,
  version: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const {
        token,
        tokenExpireAt,
        user,
        companyDetails,
        companyImage,
        version,
      } = action.payload;
      state.token = token;
      state.tokenExpireAt = tokenExpireAt;
      state.user = user;
      state.companyDetails = companyDetails;
      state.companyImage = companyImage;
      state.version = version;
    },
    logout: (state) => {
      return initialState;
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
