import { configureStore } from "@reduxjs/toolkit";
import {
    StripeServices,
    UserServices,
    LoadingSlice
} from "./reducers";

export default configureStore({
    reducer: {
        stripe: StripeServices,
        user: UserServices,
        loading: LoadingSlice
    }
})