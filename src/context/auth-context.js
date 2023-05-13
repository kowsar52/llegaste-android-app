import { createContext, useEffect, useState } from "react";
import { getData, removeData, storeData } from "../utils/Storage";
import { Keys } from "../constants";

export const AuthContext = createContext({
    token: null,
    isAuthenticated: false,
    onLogin: () => {},
    onLogout: () => {},
});

const AuthContextProvider = (props) => {
    const [authToken, setAuthToken] = useState(null);
    useEffect(() => {
        const getStoredToken = async () => {
            const res = await getData(Keys.token);
            if (res) {
                setAuthToken(res);
            }
        };
        getStoredToken();
    }, []);

    const onLogin = (token) => {
        setAuthToken(token)
        storeData(Keys.token, token)
    }

    const onLogout = () => {
        console.log('logout')
        setAuthToken(null)
        removeData(Keys.token)
    }
    
    const value = {
        token : authToken,
        isAuthenticated: !!authToken,
        onLogin ,
        onLogout
    }
    return (
        <AuthContext.Provider value={value}>
            {props.children}
        </AuthContext.Provider>
    )
}

export default AuthContextProvider;