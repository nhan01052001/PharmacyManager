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
import { NavigationContainer } from '@react-navigation/native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { MainStackParams } from '../../navigation/Stack.Navigator';
import { HeaderComponent } from '../../components/cHeadder/Header.Component';

const Tab = createMaterialTopTabNavigator();

interface IState {
    index?: number;
    isActiveWhich?: boolean,
}

const initialState: IState = {
    index: 0,
    isActiveWhich: false,
};

const { width, height } = Dimensions.get('window');

const DEFAUlT_SIZE_PADDINGHORIZONTAL = width > 410 ? 18 : 12;

const Bill: React.FC = () => {
    const route = useRoute();
    // const { item }: any = route.params;
    const navigation = useNavigation<StackNavigationProp<MainStackParams>>();
    const [{ index, isActiveWhich, }, setState] = useState<IState>({ ...initialState });

    const handleActive = (value: any) => {
        if (value === 1) {
            if (isActiveWhich) {
                setState((prevState: IState) => ({
                    ...prevState,
                    isActiveWhich: false,
                }));
            }
        } else {
            if (!isActiveWhich) {
                setState((prevState: IState) => ({
                    ...prevState,
                    isActiveWhich: true,
                }));
            }
        }
    };

    return (
        <View style={{ flex: 1 }}>
            <HeaderComponent
                titleHeader={'Đơn hàng'}
                isOptionHome={false}
                goBack={() => navigation.goBack()}
            />
            <View style={styles.tabView}>
                {/* tab bar */}
                <View style={styles.tabBar}>
                    <View style={{ flexDirection: 'row' }}>
                        <Pressable style={styles.btnTabBar} onPress={() => handleActive(1)}>
                            <Text
                                style={[
                                    styles.text,
                                    { fontSize: 20, fontWeight: '700' },
                                    !isActiveWhich && { color: '#3ea861' },
                                ]}
                            >
                                Chờ xác nhận
                            </Text>
                        </Pressable>
                        <Pressable style={styles.btnTabBar} onPress={() => handleActive(2)}>
                            <Text
                                style={[
                                    styles.text,
                                    { fontSize: 20, fontWeight: '700' },
                                    isActiveWhich && { color: '#3ea861' },
                                ]}
                            >
                                Đã xác nhận
                            </Text>
                        </Pressable>
                        <Pressable style={styles.btnTabBar} onPress={() => handleActive(2)}>
                            <Text
                                style={[
                                    styles.text,
                                    { fontSize: 20, fontWeight: '700' },
                                    isActiveWhich && { color: '#3ea861' },
                                ]}
                            >
                                Đang giao
                            </Text>
                        </Pressable>
                    </View>
                </View>

                {/* content tab view */}
                <View style={styles.contentTabView}>
                    {!isActiveWhich ? <WaitingConfirm /> : <Confirm />}
                </View>
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