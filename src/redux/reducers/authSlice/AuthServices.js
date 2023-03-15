import { createSlice } from "@reduxjs/toolkit";
import { Keys } from "../../../constants";
import {saveUserData,storeData} from  "../../../utils/Storage"

export const AuthSlice = createSlice({
    name: "auth",
    initialState: {
        user: null,
        userType: null,
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
        login: (state, action) => {
            state.user = action.payload;
            saveUserData(action.payload);
        },
        setWelcomeCheck: (state, action) => {
            state.welcomeCheck = action.payload;
            storeData(Keys.welcomeCheck, Keys.welcomeCheck);
        }
    }
})

export const { setUserType, login, setWelcomeCheck } = AuthSlice.actions;

export default AuthSlice.reducer;
