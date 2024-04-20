import React from 'react'
import { createStackNavigator } from '@react-navigation/stack';

import { BottomTabNavigator } from './BottomTab.Navigator';
import { Login } from '../screen/auth/Login.Auth';
import { Register } from '../screen/auth/Register.Auth';
import { OTP } from '../screen/auth/OTP/OTP.Auth';
import RegisterInformationPersonal from '../screen/auth/RegisterIn4.Auth';
import DetailMedicine from '../screen/medicine/DetailMedicine.medicine';
import AllMedicine from '../screen/medicine/AllMedicine.medicine';
import SearchScreen from '../screen/search/Search';
import Order from '../screen/order/Order';
import Permission from '../screen/auth/Permission.Auth';
import Cart from '../screen/cart/Cart';
import Bill from '../screen/bill/Bill';
import Paypal from '../screen/paid/paypal.paid';
import HistoryBought from '../screen/bill/historyBought/HistoryBought.bill';
import ScanFace from '../screen/ScanFace';
import FaceScanSetting from '../FaceScanSetting';

import FaceDetectionScreen from '../screen/FaceDetectionScreen';

export type ScreenName =
    "Login" |
    "Register" |
    "OTP" |
    "RegisterInformationPersonal" |
    "BottomTabNavigator" |
    "DetailMedicine" |
    "AllMedicine" |
    "SearchScreen" |
    "Order" |
    "Permission" |
    "Cart" |
    "Bill" |
    "Paypal" |
    "HistoryBought" |
    "FaceDetectionScreen" |
    "ScanFace" |
    "FaceScanSetting"
    ;


export type MainStackParams = {
    Permission: any | undefined;
    Login: any | undefined;
    Register: any | undefined;
    OTP: any | undefined;
    RegisterInformationPersonal: any | undefined;
    BottomTabNavigator: any | undefined;
    FaceDetectionScreen: any | undefined;
    FaceScanSetting: any | undefined;
};

export type RootStackParams = {
    MainStackNavigator: undefined;
    BottomTabNavigator: undefined;
    DetailMedicine: any;
    AllMedicine: any;
    SearchScreen: any
    Order: any;
    Cart: any;
    Bill: any;
    Paypal: any;
    HistoryBought: any;
    FaceDetectionScreen: any;
    ScanFace: any;
    FaceScanSetting: any;
};

export type AllStackParams = {
    Permission: any | undefined;
    Login: any | undefined;
    Register: any | undefined;
    OTP: any | undefined;
    RegisterInformationPersonal: any | undefined;
    BottomTabNavigator: any | undefined;
    MainStackNavigator: undefined;
    DetailMedicine: any;
    AllMedicine: any;
    SearchScreen: any;
    Order: any;
    Cart: any;
    Bill: any;
    Paypal: any;
    HistoryBought: any;
    FaceDetectionScreen: any;
    ScanFace: any;
    FaceScanSetting: any;
}

const MainStack = createStackNavigator<MainStackParams>();
const RootStack = createStackNavigator<RootStackParams>();

const MainStackNavigator: React.FC = () => (
    <MainStack.Navigator>
        <MainStack.Screen name='Permission' component={Permission} options={{ headerShown: false, gestureEnabled: false, }} />
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
        <RootStack.Screen
            name='AllMedicine'
            component={AllMedicine}
            options={{ headerShown: false, }}
        />
        <RootStack.Screen
            name='SearchScreen'
            component={SearchScreen}
            options={{ headerShown: false, }}
        />
        <RootStack.Screen
            name='Order'
            component={Order}
            options={{ headerShown: false, }}
        />
        <RootStack.Screen
            name='Cart'
            component={Cart}
            options={{ headerShown: false, }}
        />
        <RootStack.Screen
            name='Bill'
            component={Bill}
            options={{ headerShown: false, }}
        />
        <RootStack.Screen
            name='Paypal'
            component={Paypal}
            options={{ headerShown: false, }}
        />
        <RootStack.Screen
            name='HistoryBought'
            component={HistoryBought}
            options={{ headerShown: false, }}
        />
        <RootStack.Screen
            name='FaceDetectionScreen'
            component={FaceDetectionScreen}
            options={{ headerShown: false, }}
        />
        <RootStack.Screen
            name='ScanFace'
            component={ScanFace}
            options={{ headerShown: false, }}
        />
        <RootStack.Screen
            name='FaceScanSetting'
            component={FaceScanSetting}
            options={{ headerShown: false, }}
        />
    </RootStack.Navigator>
);