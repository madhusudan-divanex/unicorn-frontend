import { createSlice } from '@reduxjs/toolkit';

// ✅ PERMANENT FIX: App start par watchList validate karo
// Agar sessionStorage mein zyada pairs hain (purana data), toh sirf active ticker rakho
const getInitialWatchList = () => {
    try {
        const saved = JSON.parse(localStorage.getItem('watchList'));
        const activeTick = localStorage.getItem('tick') || 'OTCGBP/USD';

        // Agar saved list hai aur 5 se kam items hain — theek hai, use karo
        if (saved && Array.isArray(saved) && saved.length >= 1 && saved.length <= 5) {
            return saved;
        }

        // Warna sirf active ticker ke saath start karo (purana data reset)
        localStorage.setItem('watchList', JSON.stringify([activeTick]));
        return [activeTick];
    } catch {
        const activeTick = localStorage.getItem('tick') || 'OTCGBP/USD';
        return [activeTick];
    }
};

const initialState = {
    walletUse: sessionStorage.getItem('wallet') || 'demo',
    activeTicker: localStorage.getItem('tick') || 'OTCGBP/USD',
    watchList: getInitialWatchList(),
    demoWallet: Number(sessionStorage.getItem('demoWallet')) || 100000,
    dollerToInr: 87,
    defaultCurrency: 'inr',
    defaultLang: localStorage.getItem('defaultLang') || 'hi',
    hideBalance: false,
};

export const walletSlice = createSlice({
    name: 'wallet',
    initialState,
    reducers: {
        setWalletUse: (state, action) => {
            state.walletUse = action.payload;
        },
        setHideBalance: (state, action) => {
            state.hideBalance = action.payload;
        },

        // ✅ setActiveTicker sirf ticker change kare — watchList touch nahi
        setActiveTicker: (state, action) => {
            const ticker = action.payload;
            state.activeTicker = ticker;
            localStorage.setItem('tick', ticker);

            // ✅ check & add to watchlist if not exists
            if (!state.watchList.includes(ticker)) {
                if (state.watchList.length >= 20) {
                    state.watchList.shift();
                }
                state.watchList.push(ticker);
            }

            localStorage.setItem('watchList', JSON.stringify(state.watchList));
        },
        // ✅ addToWatchList — sirf + button se call hoga
        addToWatchList: (state, action) => {
            const newTicker = action.payload;
            state.activeTicker = newTicker;
            localStorage.setItem('tick', newTicker);

            if (!state.watchList.includes(newTicker)) {
                if (state.watchList.length >= 20) {
                    state.watchList.shift();
                }
                state.watchList.push(newTicker);
            }
            localStorage.setItem('watchList', JSON.stringify(state.watchList));
        },

        setDemoWallet: (state, action) => {
            state.demoWallet = Number(sessionStorage.getItem('demoWallet'));
        },
        setDefaultLanguage: (state, action) => {
            state.defaultLang = action.payload;
        },
        setDefaultCurrency: (state, action) => {
            state.defaultCurrency = action.payload;
        },
        setDollerToInr: (state, action) => {
            state.dollerToInr = action.payload;
        },
        toggleWalletUse: (state) => {
            state.walletUse = state.walletUse === 'live' ? 'demo' : 'live';
        },
        toggleActiveTicker: (state) => {
            state.activeTicker = state.activeTicker;
        },
        removeTickerFromWatchList: (state, action) => {
            const tickerToRemove = action.payload;
            state.watchList = state.watchList.filter(ticker => ticker !== tickerToRemove);

            if (state.watchList.length > 0) {
                state.activeTicker = state.watchList[state.watchList.length - 1];
            } else {
                state.activeTicker = 'OTCGBP/USD';
                state.watchList = ['OTCGBP/USD'];
            }

            localStorage.setItem('watchList', JSON.stringify(state.watchList));
            localStorage.setItem('tick', state.activeTicker);
        },

        // ✅ NAYA: Manual reset action — agar koi aur problem ho
        resetWatchList: (state) => {
            const activeTick = state.activeTicker || 'OTCGBP/USD';
            state.watchList = [activeTick];
            localStorage.setItem('watchList', JSON.stringify([activeTick]));
        },
    },
});

export const {
    setWalletUse, setHideBalance, setDemoWallet, setDollerToInr,
    setDefaultCurrency, setDefaultLanguage, removeTickerFromWatchList,
    toggleWalletUse, setActiveTicker, toggleActiveTicker, addToWatchList, resetWatchList
} = walletSlice.actions;

export default walletSlice.reducer;
