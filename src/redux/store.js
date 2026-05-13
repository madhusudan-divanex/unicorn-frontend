import { configureStore } from '@reduxjs/toolkit'
import userReducer from './features/userSlice'
import walletReducer from './features/walletSlice'
import authReducer from './features/authSlice'
import marketReducer from './features/marketSlice'
export const store = configureStore({
  reducer: {
    user: userReducer,
    wallet:walletReducer,
    auth:authReducer,
    market:marketReducer
  },
})