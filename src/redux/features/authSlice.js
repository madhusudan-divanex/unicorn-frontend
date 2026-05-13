// src/features/auth/authSlice.js
import { createSlice } from '@reduxjs/toolkit';



// authSlice.js
const authSlice = createSlice({
  name: 'auth',
  initialState: {
    isLogin: false,
    user: null,
  },
  reducers: {
    login: (state, action) => {
      state.isLogin = true;
      state.user = action.payload;
    },
    logout: (state) => {
      state.isLogin = false;
      state.user = null;
    },
    checkLogin: (state, action) => {
      state.isLogin = action.payload;
    }
    // ...
  },
});


export const { login, logout, checkLogin } = authSlice.actions;
export default authSlice.reducer;
