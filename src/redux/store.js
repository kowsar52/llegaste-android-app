import { configureStore } from "@reduxjs/toolkit";
import {
    AuthServices,
    StripeServices,
    UserServices,
    LoadingSlice
} from "./reducers";

export default configureStore({
    reducer: {
        auth: AuthServices,
        stripe: StripeServices,
        user: UserServices,
        loading: LoadingSlice
    }
})