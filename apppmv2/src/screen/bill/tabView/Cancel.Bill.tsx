import React, { createRef, useEffect, useState } from 'react';
import {
    StyleSheet,
    View,
    Text,
    Image,
    TouchableOpacity,
    FlatList
} from 'react-native';
import { useNavigation } from '@react-navigation/core';
import { StackNavigationProp } from '@react-navigation/stack';

import { AllStackParams } from '../../../navigation/Stack.Navigator';
import { LoadingService } from '../../../components/cLoading/Loading.component';
import Function from '../../../global/assets/service/Function.Service';
import { ENUM } from '../../../global/enum';
import HttpService from '../../../service/HttpService.Service';
import { env } from '../../../utils/env.utils';
import StylesTheme from '../../../global/theme/Styles.Theme';
import ItemBillWaiting from './ItemBillWaiting';
import { Colors } from '../../../global/theme/Colors.Theme';

interface IState {
    isCheckAll?: boolean;
    listProductInCart?: any[];
    listItemChecked?: any[];
    totalPrice: number;
}

const initialState: IState = {
    isCheckAll: false,
    listProductInCart: [],
    listItemChecked: [],
    totalPrice: 0,
};

const Cancel: React.FC = () => {
    const navigation = useNavigation<StackNavigationProp<AllStackParams>>();
    const [{ isCheckAll, listProductInCart, listItemChecked, totalPrice }, setState] = useState<IState>({ ...initialState });

    const handleGetData = async () => {
        try {
            const profile: any = await Function.getAppData(ENUM.KEY_IN4USER);

            if (profile?.id) {
                LoadingService.show();
                HttpService.Get(`${env.URL}/bill/getBillCanceled/${profile?.id}`)
                    .then((res: any) => {
                        if (res?.status === 200 && Array.isArray(res?.data)) {
                            const data: any[] = res?.data;
                            const dataChecked: any[] = [];
                            let totalPriceTemp: number = 0;
                            data.forEach((element: any) => {
                                element.isChecked = true;
                                if (element?.id) {
                                    dataChecked.push(element?.cartId);
                                }

                                if (!isNaN(Number(element?.pricePurchase))) {
                                    totalPriceTemp += Number(element?.pricePurchase);
                                }
                            })
                            setState((prevState: IState) => ({
                                ...prevState,
                                listProductInCart: data,
                                listItemChecked: dataChecked,
                                totalPrice: totalPriceTemp,
                                isCheckAll: data.length > 0 ? true : false
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
        <View style={{ flex: 1, }}>
            {
                listProductInCart && listProductInCart?.length > 0 ? (
                    <FlatList
                        data={listProductInCart}
                        renderItem={({ item, index }) => <ItemBillWaiting
                            key={index}
                            dataItem={item}
                            isAllowedCancel={false}
                            isCanceled={true}
                        />}
                        keyExtractor={item => item?.billId}
                    />
                ) : <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Image source={require('../../../global/assets/image/no-data.png')} style={{ width: 100, height: 100, }}
                    />
                    <Text style={[StylesTheme.text16]}>Bạn chưa có đơn hàng nào!</Text>
                    <TouchableOpacity
                        onPress={() => {
                            navigation.navigate('BottomTabNavigator');
                        }}
                        style={{ backgroundColor: '#f7f7f7', borderWidth: 1, borderColor: Colors.primaryColor, borderRadius: 8, width: '30%', paddingVertical: 10, alignItems: 'center', marginTop: 12 }}
                    >
                        <Text style={[StylesTheme.textLabel, { color: Colors.primaryColor }]}>Mua sắm</Text>
                    </TouchableOpacity>
                </View>
            }
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },

    item: {
        flex: 1,
        marginVertical: 12,
    },
});

export default Cancel;
