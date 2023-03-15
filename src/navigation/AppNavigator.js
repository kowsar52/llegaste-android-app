import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import {
    Login,
    Home,
    Setting,
    Profile,
    Checkout,
    ManualCheckout,
    CheckoutSuccess,
    SetupTerminal,
    Splash,
    ForgetPassword,
    ResetPassword
} from "../screens";

import {Screens} from '../constants';
import {AuthNavigator} from './AuthNavigation/AuthNavigator';


const SplashStack = createNativeStackNavigator();


const AppStack = createNativeStackNavigator();

const AppNavigator = () => {
    return (
      <NavigationContainer>
        <AppStack.Navigator screenOptions={{ headerShown: false }}>
            <AppStack.Screen name={Screens.splash} component={Splash} />
            <AppStack.Screen name={Screens.login} component={Login} />
            <AppStack.Screen name={Screens.forgetPassword} component={ForgetPassword} />
            <AppStack.Screen name={Screens.resetPassword} component={ResetPassword} />
            <AppStack.Screen name={Screens.home} component={Home} />
            <AppStack.Screen name={Screens.setting} component={Setting} />
            <AppStack.Screen name={Screens.profile} component={Profile} />
            <AppStack.Screen name={Screens.checkout} component={Checkout} />
            <AppStack.Screen name={Screens.manualCheckout} component={ManualCheckout} />
            <AppStack.Screen name="CheckoutSuccess" component={CheckoutSuccess} />
            <AppStack.Screen name={Screens.setupTerminal} component={SetupTerminal} />
        </AppStack.Navigator>
    </NavigationContainer>
    );
}

export default AppNavigator;