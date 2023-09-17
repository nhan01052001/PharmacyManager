import React from 'react'
import { createStackNavigator } from '@react-navigation/stack';

import { BottomTabNavigator } from './BottomTab.Navigator';
import { Login } from '../screen/auth/Login.Auth';
import { Register } from '../screen/auth/Register.Auth';
import { OTP } from '../screen/auth/OTP/OTP.Auth';

export type MainStackParams = {
    Login: any | undefined;
    Register: any | undefined;
    OTP: any | undefined;
    BottomTabNavigator: any | undefined;
};

export type RootStackParams = {
    MainStackNavigator: undefined;
    BottomTabNavigator: undefined;
};

const MainStack = createStackNavigator<MainStackParams>();
const RootStack = createStackNavigator<RootStackParams>();

const MainStackNavigator: React.FC = () => (
    <MainStack.Navigator>
        <MainStack.Screen name='Login' component={Login} options={{headerShown: false}} />
        <MainStack.Screen name='Register' component={Register} options={{headerShown: false}} />
        <MainStack.Screen name='OTP' component={OTP} options={{headerShown: false}} />
    </MainStack.Navigator>
);

export const RootStackNavigator: React.FC = () => (
    <RootStack.Navigator>
        <RootStack.Screen
            name='MainStackNavigator'
            component={MainStackNavigator}
            options={{headerShown: false}}
        />
        <RootStack.Screen
            name='BottomTabNavigator'
            component={BottomTabNavigator}
            options={{headerShown: false}}
        />
    </RootStack.Navigator>
);