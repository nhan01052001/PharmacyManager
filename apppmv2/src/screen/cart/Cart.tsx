import { useNavigation } from '@react-navigation/core';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useEffect, useState } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Pressable,
    FlatList,
    TouchableOpacity
} from 'react-native';

import { HeaderComponent } from '../../components/cHeadder/Header.Component';
import { AllStackParams } from '../../navigation/Stack.Navigator';
import { Colors } from '../../global/theme/Colors.Theme';
import StylesTheme from '../../global/theme/Styles.Theme';
import { CheckIcon } from '../../global/icon/Icon';
import ItemCart from './ItemCart.cart';
import Function from '../../global/assets/service/Function.Service';
import HttpService from '../../service/HttpService.Service';
import { env } from '../../utils/env.utils';
import { ENUM } from '../../global/enum';
import { LoadingService } from '../../components/cLoading/Loading.component';
import { AlertService } from '../../components/cAlert/Alert.component';

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

const Cart: React.FC = () => {
    const navigation = useNavigation<StackNavigationProp<AllStackParams>>();
    const [{ isCheckAll, listProductInCart, listItemChecked, totalPrice }, setState] = useState<IState>({ ...initialState });

    const handleGetData = async () => {
        try {
            const profile: any = await Function.getAppData(ENUM.KEY_IN4USER);

            if (profile?.id) {
                LoadingService.show();
                HttpService.Get(`${env.URL}/cart/getCartByProfileID/${profile?.id}`)
                    .then((res: any) => {
                        console.log(res, 'res');
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
                                isCheckAll: true
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

    const handleCheckItem = (cartId: string) => {
        if (cartId.length > 0 && listProductInCart && listProductInCart?.length > 0) {
            const value = listProductInCart.findIndex((item) => item?.cartId === cartId);

            if (value > -1) {
                let totalPriceTemp: number = 0;
                const product = listProductInCart[value];
                let dataChecked: any[] = [];

                if (product?.isChecked) {
                    totalPriceTemp = totalPrice - Number(product?.pricePurchase ? product?.pricePurchase : 0);
                    dataChecked = listItemChecked ? listItemChecked.filter((item) => item !== cartId) : [];
                } else {
                    totalPriceTemp = totalPrice + Number(product?.pricePurchase ? product?.pricePurchase : 0);
                    dataChecked = listItemChecked ? [...listItemChecked, cartId] : [];
                }

                product.isChecked = !product?.isChecked;

                const rs = listProductInCart.find((item: any) => item?.isChecked === false);

                setState((prevState: IState) => ({
                    ...prevState,
                    listProductInCart,
                    totalPrice: totalPriceTemp,
                    listItemChecked: dataChecked,
                    isCheckAll: rs !== null && rs !== undefined ? false : true
                }));
            }
        }
    }

    const handleCheckAll = () => {
        if (listProductInCart) {
            const dataChecked: any[] = [];
            let totalPriceTemp: number = 0;
            listProductInCart.forEach((element: any) => {
                element.isChecked = true;
                if (element?.id) {
                    dataChecked.push(element?.cartId);
                }

                if (!isNaN(Number(element?.pricePurchase))) {
                    totalPriceTemp += Number(element?.pricePurchase);
                }
            });
            setState((prevState: IState) => ({
                ...prevState,
                listProductInCart,
                listItemChecked: dataChecked,
                totalPrice: totalPriceTemp,
                isCheckAll: true
            }));
        }
    }

    const handleUncheckAll = () => {
        listProductInCart?.forEach((e) => {
            e.isChecked = false
        });
        setState((prevState: IState) => ({
            ...prevState,
            listProductInCart,
            totalPrice: 0,
            listItemChecked: [],
            isCheckAll: false
        }));
    }

    const handleChangeQuantity = (id: string, value: number, medicineId: string) => {
        try {
            LoadingService.show();
            HttpService.Post(`${env.URL}/cart/updateQuantityAndPrice`, {
                id,
                quantity: value,
                medicineId
            }).then((res: any) => {
                LoadingService.hide();
                if (res && res?.status === 200) {
                    // AlertService.show(ENUM.E_SUCCESS, 'Thêm thành công!', 5000, null);
                    listProductInCart?.forEach((e) => {
                        if (e?.price && e?.cartId === id) {
                            e.pricePurchase = value * e?.price,
                                e.quantityPurchase = value
                        }
                    });
                    setState((prevState: IState) => ({
                        ...prevState,
                        listProductInCart,
                    }));
                } else {
                    AlertService.show(ENUM.E_ERROR, 'Sản phẩm đã hết hàng', 5000, null);
                }
            })
        } catch (error) {
            LoadingService.hide();
        }
    }

    const handleDelete = () => {
        try {
            LoadingService.show();
            HttpService.Post(`${env.URL}/cart/deleteItemsInCart`, {
                ids: listItemChecked
            }).then((res: any) => {
                LoadingService.hide();
                if (res && res?.status === 200) {
                    AlertService.show(ENUM.E_SUCCESS, 'Xoá thành công!', 5000, null);
                    handleGetData();
                } else {
                    AlertService.show(ENUM.E_ERROR, 'Có lỗi trong quá trình xử lý!', 5000, null);
                }
            })
        } catch (error) {
            LoadingService.hide();
        }
    }

    return (
        <View style={{ flex: 1, backgroundColor: '#edebeb' }}>
            <HeaderComponent
                titleHeader={'Giỏ hàng '}
                isOptionHome={false}
                goBack={() => navigation.goBack()}
            />
            <View style={[{ flex: 1, }]}>
                <View style={{ padding: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Pressable
                        style={StylesTheme.onlyFlexDirectionAli_Center}
                        onPress={() => {
                            if (isCheckAll === false) {
                                handleCheckAll();
                            } else {
                                handleUncheckAll();
                            }
                        }}
                    >
                        <View
                            style={[styles.styleCheckbox, {
                                justifyContent: 'center', alignItems: 'center'
                            }, !isCheckAll ? { borderWidth: 1, borderColor: Colors.black } : { backgroundColor: Colors.primaryColor, }]}
                        >
                            {
                                isCheckAll && (
                                    <CheckIcon color={Colors.clWhite} size={16} />
                                )
                            }
                        </View>
                        <Text style={[StylesTheme.textLabel, { fontSize: 16 }]}> {isCheckAll ? 'Huỷ tất cả' : 'Chọn tất cả'} {listProductInCart && listProductInCart?.length > 0 ? `(${listProductInCart?.length})` : ""}</Text>
                    </Pressable>

                    <Pressable
                        onPress={() => {
                            if (listItemChecked && listItemChecked?.length > 0) {
                                handleDelete();
                            }
                        }}
                    >
                        <Text style={[StylesTheme.textLabel, { fontSize: 16, color: 'red' }]}>Xoá {listItemChecked && listItemChecked?.length > 0 ? `(${listItemChecked?.length})` : ""}</Text>
                    </Pressable>
                </View>


                <View>
                    {
                        listProductInCart && listProductInCart?.length > 0 ? (
                            <FlatList
                                data={listProductInCart}
                                renderItem={({ item, index }) => <ItemCart key={index} dataItem={item} onCheckItem={(cartId: string) => {
                                    handleCheckItem(cartId);
                                }}
                                    onChangeQuantity={(cartId: string, value: number, medicineId: string) => {
                                        if (cartId && medicineId && value !== null && value !== undefined) {
                                            handleChangeQuantity(cartId, value, medicineId);
                                        }
                                    }}
                                />}
                                keyExtractor={item => item.id}
                            />
                        ) : null
                    }
                </View>

                <View style={{
                    width: '100%',
                    // height: 100,
                    borderTopColor: '#ccc',
                    borderTopWidth: 1,
                    backgroundColor: '#fff',
                    position: 'absolute',
                    bottom: 0,
                    padding: 12,
                    paddingBottom: 22,
                }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                        <Text style={[StylesTheme.text16]}>Tổng tiền</Text>
                        <Text style={[StylesTheme.sizeTextLarge, { color: '#ed4040', fontWeight: '600' }]}>
                            {
                                new Intl.NumberFormat('en-US', {
                                    currency: 'VND',
                                    style: 'currency',
                                }).format(totalPrice ? Number(totalPrice) : 0).replace('₫', '')
                            } ₫
                        </Text>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <TouchableOpacity
                            style={{ backgroundColor: '#f7f7f7', borderWidth: 1, borderColor: Colors.primaryColor, borderRadius: 8, width: '30%', paddingVertical: 10, alignItems: 'center' }}
                        >
                            <Text style={[StylesTheme.textLabel, { color: Colors.primaryColor }]}>Mua thêm</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => {
                                navigation.navigate('Order', {
                                    params: listProductInCart,
                                    totalPrice
                                });
                            }}
                            style={{ backgroundColor: '#fa9450', borderWidth: 1, borderColor: Colors.primaryColor, borderRadius: 8, width: '65%', paddingVertical: 10, alignItems: 'center' }}
                        >
                            <Text style={[StylesTheme.textLabel, { color: Colors.clWhite }]}>Đặt hàng</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </View >
    )
}

const styles = StyleSheet.create({
    styleCheckbox: {
        width: 24,
        height: 24,
        borderRadius: 24,
        marginRight: 6,
    },

    text: {
        fontSize: 18,
        fontWeight: '400',
    },
})

export default Cart;