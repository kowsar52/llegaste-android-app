import { createSlice } from "@reduxjs/toolkit";

const StripeSlice = createSlice({
    name: "stripe",
    initialState: {
        stripe: null,
        terminal: null
    },
    reducers: {
        setStripe: (state, action) => {
            state.stripe = action.payload;
        },
        setTerminal: (state, action) => {
            state.terminal = action.payload;
        }
    }
        
});

export const { setStripe, setTerminal } = StripeSlice.actions;

export default StripeSlice.reducer;