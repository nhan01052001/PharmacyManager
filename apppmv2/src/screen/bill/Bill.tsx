import { useNavigation, useRoute } from '@react-navigation/core';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useEffect, useState, useCallback } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Pressable,
    FlatList,
    TouchableOpacity,
    Dimensions,
    Platform,
} from 'react-native';

import WaitingConfirm from './tabView/WaitingConfirm.Bill';
import Confirm from './tabView/Confirm.Bill';
import Delevering from './tabView/Delevering.Bill';
import Cancel from './tabView/Cancel.Bill';
import { NavigationContainer } from '@react-navigation/native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { MainStackParams } from '../../navigation/Stack.Navigator';
import { HeaderComponent } from '../../components/cHeadder/Header.Component';
import { Colors } from '../../global/theme/Colors.Theme';
import HttpService from '../../service/HttpService.Service';
import Function from '../../global/assets/service/Function.Service';
import { LoadingService } from '../../components/cLoading/Loading.component';
import { env } from '../../utils/env.utils';
import { ENUM } from '../../global/enum';

const Tab = createMaterialTopTabNavigator();

interface IState {
    index?: number;
    isActiveWhich?: boolean,
    waiting?: number,
    confirm?: number,
    delivering?: number,
    cancel?: number
}

const initialState: IState = {
    index: 0,
    isActiveWhich: false,
    waiting: 0,
    confirm: 0,
    delivering: 0,
    cancel: 0
};

const { width, height } = Dimensions.get('window');

const DEFAUlT_SIZE_PADDINGHORIZONTAL = width > 410 ? 18 : 12;

const Bill: React.FC = () => {
    const route = useRoute();
    // const { item }: any = route.params;
    const navigation = useNavigation<StackNavigationProp<MainStackParams>>();
    const [{ index, isActiveWhich, waiting, confirm, delivering, cancel }, setState] = useState<IState>({ ...initialState });

    const handleGetData = async () => {
        try {
            const profile: any = await Function.getAppData(ENUM.KEY_IN4USER);

            if (profile?.id) {
                LoadingService.show();
                Promise.all(
                    [
                        HttpService.Get(`${env.URL}/cart/getCartOrderByProfileID/${profile?.id}`),
                        HttpService.Get(`${env.URL}/bill/getBillConfirmed/${profile?.id}`),
                        HttpService.Get(`${env.URL}/bill/getBillDelivering/${profile?.id}`),
                        HttpService.Get(`${env.URL}/bill/getBillCanceled/${profile?.id}`)
                    ]
                ).then((resAll: any) => {console.log(resAll, 'resAll');
                
                
                        if(Array.isArray(resAll) && resAll.length === 4) {
                            const [res1, res2, res3, res4] = resAll;
                            setState((prevState: IState) => ({
                                ...prevState,
                                waiting: Array.isArray(res1?.data) ? res1?.data.length : 0,
                                confirm: Array.isArray(res2?.data) ? res2?.data.length : 0,
                                delivering: Array.isArray(res3?.data) ? res3?.data.length : 0,
                                cancel: Array.isArray(res4?.data) ? res4?.data.length : 0,
                            }));
                        }
                        LoadingService.hide();
                    }).catch((error) => {
                        LoadingService.hide();
                        // show screen error
                    })
            }
        } catch (error) {
            // handle screen error
        }
    }

    useEffect(() => {
        handleGetData();
    }, []);

    return (
        <View style={{ flex: 1 }}>
            <HeaderComponent
                titleHeader={'Đơn hàng'}
                isOptionHome={false}
                goBack={() => navigation.goBack()}
            />
            <View style={styles.tabView}>
                <Tab.Navigator
                    screenOptions={{
                        tabBarActiveTintColor: Colors.primaryColor,
                        tabBarInactiveTintColor: '#ccc',
                        tabBarStyle: {
                            backgroundColor: Colors.clWhite,
                        },
                        tabBarLabelStyle: {
                            textAlign: 'center',
                            fontSize: 12
                        },
                        tabBarIndicatorStyle: {
                            borderBottomColor: '#87B56A',
                            borderBottomWidth: 2,
                        },
                        tabBarScrollEnabled: true
                    }}
                >
                    <Tab.Screen
                        name="WaitingConfirm"
                        component={WaitingConfirm}
                        options={{
                            tabBarLabel: 'Chờ xác nhận',
                            tabBarBadge:()=> { return (  <Text style={{color: 'red'}}>{waiting}</Text> ) }
                        }} />
                    <Tab.Screen
                        name="Confirm"
                        component={Confirm}
                        options={{
                            tabBarLabel: 'Xác nhận',
                            tabBarBadge:()=> { return (  <Text style={{color: 'red'}}>{confirm}</Text> ) }
                        }} />
                    <Tab.Screen
                        name="Delevering"
                        component={Delevering}
                        options={{
                            tabBarLabel: 'Đang giao',
                            tabBarBadge:()=> { return (  <Text style={{color: 'red'}}>{delivering}</Text> ) }
                        }} />
                    <Tab.Screen
                        name="Cancel"
                        component={Cancel}
                        options={{
                            tabBarLabel: 'Đã huỷ',
                            tabBarBadge:()=> { return (  <Text style={{color: 'red'}}>{cancel}</Text> ) }
                        }} />
                </Tab.Navigator>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    scene: {
        flex: 1,
    },

    headerActive: {
        backgroundColor: '#fff',
        paddingVertical: 12,
        top: Platform.OS === 'android' ? 0 : 40,
        borderBottomColor: '#ccc',
        borderBottomWidth: 0.5,
        shadowOffset: { width: -2, height: 4 },
        shadowColor: '#171717',
        shadowOpacity: 0.2,
        shadowRadius: 3,
    },

    // wrapContent: {
    //     position: 'absolute',
    //     height: '100%',
    //     width: '100%',
    //     backgroundColor: 'transparent',
    //     top: 100,
    // },

    image: {
        flex: 1,
    },

    slide: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent',
    },

    text: {
        fontSize: 18,
        fontWeight: '400',
        marginVertical: 12,
    },

    in4MainProduct: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 16,
    },

    tabView: {
        flex: 1,
    },

    tabBar: {
        borderColor: '#ccc',
        borderWidth: 1,
        backgroundColor: '#fff',
    },
    btnTabBar: {
        width: '50%',
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 6,
    },

    contentTabView: {
        flex: 1,
        backgroundColor: '#fff',
    },

    wrapImgProduct: {
        flex: 1,
        height: height / 2,
        backgroundColor: '#fff',
    },

    wrapContent: {
        flex: 1,
        backgroundColor: '#fff',
        marginBottom: 50,
    },

    listProductPortfolio: {
        marginVertical: 4,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'flex-start',
    },

    listProduct: {
        marginVertical: 16,
    },

    flRowBetween: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },

    bgOpacity: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: height,
        backgroundColor: 'black',
        opacity: 0.7,
        zIndex: 4,
        elevation: 4,
    },

    wrapContentModal: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: height / 2,
        backgroundColor: '#fff',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        zIndex: 5,
        elevation: 5,
    },
    quantityCart: {
        backgroundColor: 'red',
        position: 'absolute',
        borderRadius: 16,
        width: 26,
        height: 26,
        justifyContent: 'center',
        alignItems: 'center',
        right: -10,
        top: -10,
    },
});

export default Bill;