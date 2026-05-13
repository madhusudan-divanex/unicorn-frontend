// marketSlice.js

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  fx: [],
  crypto: [],
  stocks: [],
};

const marketSlice = createSlice({
  name: "market",
  initialState,
  reducers: {
    setFx: (state, action) => {
      state.fx = action.payload;
    },
    setCrypto: (state, action) => {
      state.crypto = action.payload;
    },
    setStocks: (state, action) => {
      state.stocks = action.payload;
    },
  },
});

export const { setFx, setCrypto, setStocks } = marketSlice.actions;
export default marketSlice.reducer;