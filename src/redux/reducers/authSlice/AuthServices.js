import { createSlice } from "@reduxjs/toolkit";
import { Keys } from "../../../constants";
import {saveUserData,storeData} from  "../../../utils/Storage"

export const AuthSlice = createSlice({
    name: "auth",
    initialState: {
        user: null,
        userType: null,
        userPrinter: null,
        token: null,
        isLogin: false,
        isLoading: false,
        error: null,
    },
    reducers: {
        setUserType: (state, action) => {
            state.userType = action.payload;
            storeData(Keys.userType, action.payload);
        },
        setUserPrinter: (state, action) => {
            state.userPrinter = action.payload;
            storeData(Keys.userPrinter, action.payload);
        },
        login: (state, action) => {
            state.user = action.payload;
            state.token = action.payload.token;
            saveUserData(action.payload);
            storeData(Keys.token, action.payload.token);
        },
        setWelcomeCheck: (state, action) => {
            state.welcomeCheck = action.payload;
            storeData(Keys.welcomeCheck, Keys.welcomeCheck);
        }
    }
})

export const { setUserType, login, setWelcomeCheck, setUserPrinter } = AuthSlice.actions;

export default AuthSlice.reducer;

