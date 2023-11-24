import React from 'react'
import { createStackNavigator } from '@react-navigation/stack';

import { BottomTabNavigator } from './BottomTab.Navigator';
import { Login } from '../screen/auth/Login.Auth';
import { Register } from '../screen/auth/Register.Auth';
import { OTP } from '../screen/auth/OTP/OTP.Auth';
import RegisterInformationPersonal from '../screen/auth/RegisterIn4.Auth';
import DetailMedicine from '../screen/medicine/DetailMedicine.medicine';

export type ScreenName =
    "Login" | 
    "Register" |
    "OTP" |
    "RegisterInformationPersonal" |
    "BottomTabNavigator" |
    "DetailMedicine";


export type MainStackParams = {
    Login: any | undefined;
    Register: any | undefined;
    OTP: any | undefined;
    RegisterInformationPersonal: any | undefined;
    BottomTabNavigator: any | undefined;
};

export type RootStackParams = {
    MainStackNavigator: undefined;
    BottomTabNavigator: undefined;
    DetailMedicine: any;
};

export type AllStackParams = {
    Login: any | undefined;
    Register: any | undefined;
    OTP: any | undefined;
    RegisterInformationPersonal: any | undefined;
    BottomTabNavigator: any | undefined;
    MainStackNavigator: undefined;
    DetailMedicine: any;
}

const MainStack = createStackNavigator<MainStackParams>();
const RootStack = createStackNavigator<RootStackParams>();

const MainStackNavigator: React.FC = () => (
    <MainStack.Navigator>
        <MainStack.Screen name='Login' component={Login} options={{ headerShown: false, gestureEnabled: false, }} />
        <MainStack.Screen name='Register' component={Register} options={{ headerShown: false, gestureEnabled: false, }} />
        <MainStack.Screen name='OTP' component={OTP} options={{ headerShown: false, gestureEnabled: false, }} />
        <MainStack.Screen name='RegisterInformationPersonal' component={RegisterInformationPersonal} options={{ headerShown: false, gestureEnabled: false, }} />
    </MainStack.Navigator>
);

export const RootStackNavigator: React.FC = () => (
    <RootStack.Navigator>
        <RootStack.Screen
            name='MainStackNavigator'
            component={MainStackNavigator}
            options={{ headerShown: false, gestureEnabled: false, }}
        />
        <RootStack.Screen
            name='BottomTabNavigator'
            component={BottomTabNavigator}
            options={{ headerShown: false, gestureEnabled: false, }}
        />
        <RootStack.Screen
            name='DetailMedicine'
            component={DetailMedicine}
            options={{ headerShown: false, gestureEnabled: false, }}
        />
    </RootStack.Navigator>
);