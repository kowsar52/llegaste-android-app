import React,{useContext} from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import {
    Login,
    Home,
    Setting,
    TerminalSetting,
    PrinterSetting,
    ProfileSetting,
    PinSetting,
    Profile,
    Checkout,
    ManualCheckout,
    CheckoutSuccess,
    SetupTerminal,
    Splash,
    ForgetPassword,
    ResetPassword,
    Pin
} from "../screens";

import {Screens} from '../constants';
import {AuthNavigator} from './AuthNavigation/AuthNavigator';
import  { AuthContext } from "../context/auth-context";


const Stack = createNativeStackNavigator();

 const AuthStack = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name={Screens.login} component={Login} />
            <Stack.Screen name={Screens.splash} component={Splash} />
            <Stack.Screen name={Screens.forgetPassword} component={ForgetPassword} />
            <Stack.Screen name={Screens.resetPassword} component={ResetPassword} />
        </Stack.Navigator>
    )
}

 const AppStack = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name={Screens.splash} component={Splash} />
            <Stack.Screen name={Screens.setupTerminal} component={SetupTerminal} />
            <Stack.Screen name={Screens.home} component={Home} />
            <Stack.Screen name={Screens.setting} component={Setting} />
            <Stack.Screen name={Screens.terminalSetting} component={TerminalSetting} />
            <Stack.Screen name={Screens.printerSetting} component={PrinterSetting} />
            <Stack.Screen name={Screens.profileSetting} component={ProfileSetting} />
            <Stack.Screen name={Screens.pinSetting} component={PinSetting} />
            <Stack.Screen name={Screens.profile} component={Profile} />
            <Stack.Screen name={Screens.checkout} component={Checkout} />
            <Stack.Screen name={Screens.manualCheckout} component={ManualCheckout} />
            <Stack.Screen name="CheckoutSuccess" component={CheckoutSuccess} />
          
        </Stack.Navigator>
    )
}




export const AppNavigator = () => {
    const authCTX = useContext(AuthContext);
    console.log('authCTX',authCTX)
    return (
        <NavigationContainer>
          {!authCTX.isAuthenticated && <AuthStack/>}
            {authCTX.isAuthenticated && <AppStack/>}
        </NavigationContainer>
    )
}
