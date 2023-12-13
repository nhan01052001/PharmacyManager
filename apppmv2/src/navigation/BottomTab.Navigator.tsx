import React from 'react'
import { StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import Home from '../screen/home/Home';
import Setting from '../screen/setting/Setting';
import { HomeIcon, SettingIcon, OrderIcon } from '../global/icon/Icon';
import { Colors } from '../global/theme/Colors.Theme';
import Bill from '../screen/bill/Bill';

const BottomTabs = createBottomTabNavigator();

export const BottomTabNavigator: React.FC = () => (
    <BottomTabs.Navigator
        initialRouteName='Home'
        screenOptions={({ route }) => ({
            tabBarActiveTintColor: Colors.primaryColor,
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

                if (route.name === 'Bill') {
                    return <OrderIcon color={color} size={size} />
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
            name='Bill'
            component={Bill}
            options={{ headerShown: false, title: 'Đơn hàng', tabBarBadge: 3, unmountOnBlur: true }}
        />
        <BottomTabs.Screen
            name='Setting'
            component={Setting}
            options={{ headerShown: false, title: 'Cài đặt', unmountOnBlur: true }}
        />
    </BottomTabs.Navigator>
);

const styles = StyleSheet.create({
    upSize: {
        height: 100
    }
})