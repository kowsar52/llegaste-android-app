import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import {
    Login,
    ForgetPassword,
    ResetPassword,
} from '../../screens';

import {Screens} from '../../constants';

const AuthStack = createNativeStackNavigator();

const AuthNavigator = () => {
    return (
        <AuthStack.Navigator screenOptions={{ headerShown: false }}>
            <AuthStack.Screen name={Screens.login} component={Login} />
            <AuthStack.Screen name={Screens.forgetPassword} component={ForgetPassword} />
            <AuthStack.Screen name={Screens.resetPassword} component={ResetPassword} />
        </AuthStack.Navigator>
    );
}

export default AuthNavigator;