// src/redux/features/userSlice.js
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { base_url } from '../../baseUrl';

const initialState = {
    userData: null,
    userSetting: null,
    joinedTournament:null,
    loading: false,
    totalUserTrade:0,
    totalUserOrder:0,
    userRead:[],
    userKyc:{},
    userTrade:[],
    userOrder:[],
    userDeposit:[],
    userWithdraw:[],
    error: null,
    myRefferals:0
};

// ✅ Async thunk to fetch user data
// userSlice.js

export const fetchUserData = createAsyncThunk(
    'user/fetchUserData',
    async (_, { rejectWithValue }) => {
        try {
            const userId = JSON.parse(localStorage.getItem('userId'));
            const token = JSON.parse(localStorage.getItem('token'));

            if (!userId || !token) {
                return rejectWithValue("User ID or token missing");
            }

            const response = await axios.get(`${base_url}/get-user-data/${userId}`, {
                headers: {
                    'Token': token,
                },
            });

            if (!response.data.success) {
                const loginData = localStorage.getItem('loginData');
                localStorage.clear();

                if (loginData && navigate) {
                    localStorage.setItem('loginData', JSON.stringify(loginData));
                    
                }
                return rejectWithValue("User not authenticated");
            }

            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);


// ✅ Redux slice
export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        // Add reducers here if needed (e.g. logout)
         setUserData: (state, action) => {
            state.userData = action.payload.user || null;
            state.userDeposit = action.payload.userDeposit || [];
            state.userWithdraw = action.payload.userWithdraw || [];
            state.userTrade = action.payload.userTrade || [];
            state.totalUserTrade = action.payload.totalUserTrade || 0;
            state.userRead = action.payload.userRead || [];
            state.joinedTournament = action.payload.userTournament || null;
            state.userKyc = action.payload.userKyc || {};
            state.userOrder = action.payload.userOrder || [];
            state.totalUserOrder = action.payload.totalUserOrder || 0;
            state.userSetting = action.payload.userSetting || null;
            state.myRefferals = action.payload.myRefferals || 0;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchUserData.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUserData.fulfilled, (state, action) => {
                state.loading = false;
                state.userData = action.payload.user;
                state.userDeposit=action.payload.userDeposit;
                state.userWithdraw=action.payload.userWithdraw;
                state.userTrade=action.payload.userTrade;
                state.totalUserTrade=action.payload.totalUserTrade
                state.userRead=action.payload.userRead
                state.joinedTournament = action.payload.userTournament;
                state.userKyc = action.payload.userKyc;
                state.userOrder = action.payload.userOrder;
                state.totalUserOrder = action.payload.totalUserOrder
                state.userSetting = action.payload.userSetting
                state.myRefferals = action.payload.myRefferals
            })
            .addCase(fetchUserData.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});
export const { setUserData } = userSlice.actions;
export default userSlice.reducer;
