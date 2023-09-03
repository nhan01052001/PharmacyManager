import React from 'react'
import { StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import Home from '../screen/home/Home';
import Setting from '../screen/setting/Setting';
import { HomeIcon, SettingIcon } from '../global/icon/Icon';

const BottomTabs = createBottomTabNavigator();

export const BottomTabNavigator: React.FC = () => (
    <BottomTabs.Navigator
        initialRouteName='Home'
        screenOptions={({ route }) => ({
            tabBarActiveTintColor: "#4eac6d",
            tabBarInactiveTintColor: 'grey',
            tabBarShowLabel: true,
            tabBarLabelStyle: {
                fontSize: 13,
                fontWeight: "700",
            },
            tabBarIcon: ({ color, size }) => {
                if (route.name === 'Home') {
                    return <HomeIcon color={color} size={size} />
                }

                if (route.name === 'Setting') {
                    return <SettingIcon color={color} size={size} />
                }

                return null;
            },

        })}
    >
        <BottomTabs.Screen
            name="Home"
            component={Home}
            options={{ headerShown: false, title: 'Trang chủ' }}
        />
        <BottomTabs.Screen
            name='Setting'
            component={Setting}
            options={{ headerShown: false, title: 'Cài đặt' }}
        />
    </BottomTabs.Navigator>
);

const styles = StyleSheet.create({
    upSize: {
        height: 100
    }
})