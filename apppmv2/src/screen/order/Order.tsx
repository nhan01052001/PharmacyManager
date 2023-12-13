import { useNavigation, useRoute } from '@react-navigation/core';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useEffect, useState, useCallback, useRef } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Pressable,
    FlatList,
    TouchableOpacity,
    Modal,
    TextInput,
    ScrollView
} from 'react-native';

import { HeaderComponent } from '../../components/cHeadder/Header.Component';
import { AllStackParams } from '../../navigation/Stack.Navigator';
import { Colors } from '../../global/theme/Colors.Theme';
import StylesTheme from '../../global/theme/Styles.Theme';
import { CheckIcon, CloseIcon, LocationIcon } from '../../global/icon/Icon';
import Function from '../../global/assets/service/Function.Service';
import HttpService from '../../service/HttpService.Service';
import { env } from '../../utils/env.utils';
import { ENUM } from '../../global/enum';
import { LoadingService } from '../../components/cLoading/Loading.component';
import ItemOrder from './ItemOrder.order';
import PickerQuicklyComponent from '../../components/cPickerQuickly/PickerQuickly.component';
import { TypeDefault } from '../../type/Type';
import AddressComponent from '../../components/cAddress/Address.component';
import TextInputComponent from '../../components/cTextInput/TextInput.component';
import { AlertService } from '../../components/cAlert/Alert.component';

interface IState {
    deliveryForm?: TypeDefault,
    address?: any,
    modalVisible?: boolean,
    addressDetail?: any,
    payments?: any,
    listDeliveryAddress?: any[],
    modalVisibleA?: boolean,
    addressChoose?: any[];
}

const initialState: IState = {
    deliveryForm: {
        value: null,
        data: [
            {
                id: '1',
                name: 'Nhận tại cửa hàng',
                Value: 'E_DIRECT',
            },
            {
                id: '2',
                name: 'Giao hàng Online',
                Value: 'E_ONLINE',
            }
        ],
        isRefresh: false
    },
    address: {
        label: 'Địa chỉ',
        value: [],
        isObligatory: true,
        isRefresh: false
    },
    modalVisible: false,
    addressDetail: {
        label: 'Số nhà, tên đường',
        value: null,
        isObligatory: true,
        isRefresh: false
    },
    payments: {
        value: null,
        data: [
            {
                id: '1',
                name: 'Tiền mặt',
                Value: 'E_CASH',
            },
            {
                id: '2',
                name: 'Thanh toán online bằng paypal',
                Value: 'E_ONLINE',
            }
        ],
        isRefresh: false
    },
    listDeliveryAddress: [],
    modalVisibleA: false,
    addressChoose: []
};

const Order: React.FC = () => {
    const navigation = useNavigation<StackNavigationProp<AllStackParams>>();
    const route = useRoute();
    const { params, totalPrice }: any = route.params;
    const [{ deliveryForm, address, addressDetail, modalVisible, payments, listDeliveryAddress, modalVisibleA, addressChoose }, setState] = useState<IState>({ ...initialState });
    const ref = useRef(null);

    const handleWhenSetDeliveryForm = useCallback((value: any) => {
        if (value) {
            setState((prevState: IState) => ({
                ...prevState,
                deliveryForm: {
                    ...prevState.deliveryForm,
                    value,
                    isRefresh: !deliveryForm?.isRefresh
                },
            }));
        }
    }, []);

    const handleWhenSetPayments = useCallback((value: any) => {
        if (value) {
            setState((prevState: IState) => ({
                ...prevState,
                payments: {
                    ...prevState.payments,
                    value,
                    isRefresh: !payments?.isRefresh
                },
            }));
        }
    }, []);

    const handleOrder = () => {
        try {
            if (address.value.length < 3) {
                AlertService.show(ENUM.E_ERROR, 'Vui lòng chọn địa chỉ!', 3000, "Cảnh báo");
                return;
            }

            if (!addressDetail.value) {
                AlertService.show(ENUM.E_ERROR, 'Vui lòng điền số nhà hoặc tên đường!', 3000, "Cảnh báo");
                return;
            }

            if (!deliveryForm?.value) {
                AlertService.show(ENUM.E_ERROR, 'Vui lòng chọn hình thức nhận hàng!', 3000, "Cảnh báo");
                return;
            }

            if (!payments?.value) {
                AlertService.show(ENUM.E_ERROR, 'Vui lòng chọn hình thức thanh toán!', 3000, "Cảnh báo");
                return;
            }

            let cartId: string[] = [];

            if (Array.isArray(params)) {
                params.map((item: any) => {
                    if (item?.cartId) {
                        cartId.push(item?.cartId);
                    }
                })
            }

            let arrAddress = [];
            if (address.value[2]?.full_name) {
                arrAddress.push(address.value[2]?.full_name);
            }
            if (address.value[1]?.full_name) {
                arrAddress.push(address.value[1]?.full_name);
            }
            if (address.value[0]?.full_name) {
                arrAddress.push(address.value[0]?.full_name);
            }

            let dataBody = {
                address: addressDetail.value + ", " + arrAddress.join(", "),
                deliveryForm: deliveryForm.value?.Value,
                paymentsForm: payments?.value.Value
            }

            if (cartId.length > 0) {
                LoadingService.show();
                HttpService.Post(`${env.URL}/cart/setStatusItemsInCart`, {
                    ids: cartId,
                    isPaid: dataBody.paymentsForm === 'E_ONLINE' ? true : false,
                    deliveryAddress: dataBody.address
                }).then((res: any) => {
                    LoadingService.hide();
                    if (res && res?.status === 200) {
                        AlertService.show(ENUM.E_SUCCESS, res?.message, 3000);
                        navigation.navigate('BottomTabNavigator');
                    } else {
                        AlertService.show(ENUM.E_ERROR, 'Đặt hàng thành công!', 3000, "Lỗi");
                    }
                })
            }
        } catch (error) {
            AlertService.show(ENUM.E_ERROR, 'Có lỗi trong quá trình xử lý!', 3000, "Lỗi");
        }
    }

    const handleGetDataUser = async () => {
        try {
            const user: any = await Function.getAppData(ENUM.KEY_IN4USER);
            if (user?.deliveryAddress && Array.isArray(JSON.parse(user?.deliveryAddress)) && JSON.parse(user?.deliveryAddress).length > 0) {
                const listDeliveryAddressTemp: any[] = JSON.parse(user?.deliveryAddress);
                let address: any[] = [];
                if (listDeliveryAddressTemp.length === 1) {
                    listDeliveryAddressTemp.forEach((element) => {
                        if (Array.isArray(element) && element.length >= 3) {
                            if (element.length === 3) {
                                element.push({
                                    code: '99999',
                                    isSelected: true,
                                })
                            } else {
                                element[3] = {
                                    ...element[3],
                                    isSelected: true,
                                }
                            }
                        }
                    });
                    address = listDeliveryAddressTemp[0];
                } else {
                    listDeliveryAddressTemp.find((item) => {
                        if (Array.isArray(item) && item.length >= 4 && item[3]?.isSelected) {
                            address = item;
                        }
                    })
                }

                setState((prevState: IState) => ({
                    ...prevState,
                    listDeliveryAddress: listDeliveryAddressTemp,
                    address: {
                        ...prevState?.address,
                        value: address,
                        isRefresh: !prevState?.address.isRefresh
                    }
                }));
            }
        } catch (error) {
            AlertService.show(ENUM.E_ERROR, 'Không thể lấy được danh sách địa chỉ!', 3000, null);
        }
    }

    useEffect(() => {
        handleGetDataUser();
    }, []);
    console.log(listDeliveryAddress, 'listDeliveryAddress');

    return (
        <View style={styles.container}>
            <HeaderComponent
                titleHeader={'Đặt hàng'}
                isOptionHome={false}
                goBack={() => navigation.goBack()}
            />
            <View style={{ padding: 12, }}>
                <Text style={[StylesTheme.textLabel, { fontSize: 18 }]}>Đặt hàng: {params?.length} sản phẩm</Text>
            </View>
            <View style={{}}>
                {
                    params && params?.length > 0 ? (
                        <FlatList
                            data={params}
                            renderItem={({ item, index }) => <ItemOrder dataItem={item} />}
                            keyExtractor={item => item.id}
                        />
                    ) : null
                }
            </View>
            <View style={{ flex: 1, backgroundColor: Colors.clWhite }}>
                <View style={{ flex: 1 }}>
                    <View style={{ height: 60, width: '100%', justifyContent: 'center', padding: 16, }}>
                        <PickerQuicklyComponent
                            data={deliveryForm?.data}
                            label='Hình thức nhận hàng'
                            value={deliveryForm?.value}
                            fieldDisplay="name"
                            onFinish={(value: any) => {
                                handleWhenSetDeliveryForm(value);
                            }}
                            isRefresh={deliveryForm?.isRefresh}
                            isDataLocal={true}
                        />
                    </View>
                    <View style={{ height: 70, width: '100%', paddingHorizontal: 12, }}>
                        <TouchableOpacity style={{ padding: 12, borderColor: '#ccc', borderWidth: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}
                            onPress={() => {
                                setState((prevState: IState) => ({
                                    ...prevState,
                                    modalVisible: true,
                                }));
                            }}
                        >
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <LocationIcon size={22} color='#000' />
                                <Text numberOfLines={2} style={[StylesTheme.text16, { marginLeft: 12, maxWidth: '90%' }]}>
                                    {
                                        !Array.isArray(address?.value) || (Array.isArray(address?.value) && address?.value.length === 0)
                                            ? 'Chọn địa chỉ'
                                            : `${address?.value[3]?.name ? address?.value[3]?.name + ',' : ''
                                            } ${address?.value[2]?.full_name}, ${address?.value[1]?.full_name}, ${address?.value[0]?.full_name}
                                        `
                                    }
                                </Text>
                            </View>
                            {
                                !Array.isArray(address?.value) || (Array.isArray(address?.value) && address?.value.length === 0) && (
                                    <Text style={{ fontSize: 22, fontWeight: '700' }}>+</Text>
                                )
                            }
                        </TouchableOpacity>
                    </View>
                    <View style={{ height: 60, width: '100%', justifyContent: 'center', padding: 16, }}>
                        <PickerQuicklyComponent
                            data={payments?.data}
                            label='Hình thức thanh toán'
                            value={payments?.value}
                            fieldDisplay="name"
                            onFinish={(value: any) => {
                                handleWhenSetPayments(value);
                            }}
                            isRefresh={payments?.isRefresh}
                            isDataLocal={true}
                        />
                    </View>
                </View>
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
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <View style={{ flex: 1, }}>
                        <Text style={[StylesTheme.text16]}>Tổng tiền thanh toán</Text>
                        <Text style={[StylesTheme.sizeTextLarge, { color: '#ed4040', fontWeight: '600' }]}>
                            {
                                new Intl.NumberFormat('en-US', {
                                    currency: 'VND',
                                    style: 'currency',
                                }).format(totalPrice ? Number(totalPrice) : 0).replace('₫', '')
                            } ₫
                        </Text>
                    </View>
                    <View style={{ flex: 1, alignItems: 'flex-end' }}>
                        <TouchableOpacity
                            onPress={() => {
                                // handleOrder();
                                navigation.navigate('Paypal');
                            }}
                            style={{ backgroundColor: '#fa9450', borderRadius: 8, width: '75%', paddingVertical: 10, alignItems: 'center' }}
                        >
                            <Text style={[StylesTheme.textLabel, { color: Colors.clWhite }]}>Đặt hàng</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                style={{ zIndex: 98, elevation: 98 }}
            >
                <View style={styles.centeredView}>
                    <TouchableOpacity style={{ flex: 1, }}
                        onPress={() => {
                            setState((prevState: IState) => ({
                                ...prevState,
                                modalVisible: false,
                            }));
                        }}
                    >

                    </TouchableOpacity>
                    <View style={[{
                        flex: 1, backgroundColor: '#fff', borderTopLeftRadius: 22, borderTopRightRadius: 22,
                        shadowColor: '#000',
                        shadowOffset: {
                            width: 0,
                            height: 2,
                        },
                        shadowOpacity: 0.25,
                        shadowRadius: 4,
                        elevation: 5,
                    }, listDeliveryAddress?.length === 0 && { flex: 0.3, }]}>
                        <View style={{ padding: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Text style={[StylesTheme.text16]}>Chọn địa chỉ</Text>
                            <Pressable
                                style={[{ padding: 12 }]}
                                onPress={() => {
                                    setState((prevState: IState) => ({
                                        ...prevState,
                                        modalVisible: false,
                                    }));
                                }}>
                                <CloseIcon size={16} color='#000' />
                            </Pressable>
                        </View>

                        <ScrollView style={{ flex: 1, }}>
                            {
                                listDeliveryAddress && listDeliveryAddress?.length > 0 && (
                                    listDeliveryAddress?.map((item, index) => {
                                        if (Array.isArray(item)) {
                                            return (
                                                <TouchableOpacity
                                                    onPress={() => {
                                                        const rsFind = listDeliveryAddress.find((item) => item[3] && item[3]?.isSelected)
                                                        console.log(rsFind, '123')
                                                    }}
                                                    key={index} style={{
                                                        width: '100%',
                                                        borderColor: '#ccc',
                                                        borderBottomWidth: 1, paddingVertical: 12,
                                                        justifyContent: 'center'
                                                    }}>
                                                    <View style={{
                                                        paddingHorizontal: 12,
                                                        flexDirection: 'row',
                                                        alignItems: 'center'
                                                    }}>
                                                        <View style={[{
                                                            width: 26,
                                                            height: 26,
                                                            borderRadius: 26,
                                                            borderColor: 'black',
                                                            borderWidth: 1
                                                        }, item[3]?.isSelected && { backgroundColor: Colors.primaryColor }]} />
                                                        <View style={{
                                                            marginLeft: 12,
                                                        }}>
                                                            <Text style={[StylesTheme.text16, { maxWidth: '100%', paddingRight: 8 }]} numberOfLines={2}>
                                                                {item[3]?.name ? item[3]?.name : ''},
                                                                {item[2]?.full_name},
                                                                {item[1]?.full_name},
                                                                {item[0]?.full_name}
                                                            </Text>
                                                        </View>
                                                    </View>
                                                </TouchableOpacity>
                                            )
                                        }
                                    })
                                )
                            }
                        </ScrollView>

                        <View style={[listDeliveryAddress?.length === 0 ? { flex: 0.3, justifyContent: 'center', alignItems: 'center', } : { flex: 0.3, justifyContent: 'flex-start', alignItems: 'center', }]}>
                            {/* <TouchableOpacity style={{ backgroundColor: Colors.primaryColor, paddingVertical: 12, paddingHorizontal: 22, borderRadius: 8 }}>
                                <Text style={[StylesTheme.text16]}>Thêm địa chỉ
                                    <Text style={{ fontSize: 22, fontWeight: '700' }}>  +</Text>
                                </Text>
                            </TouchableOpacity> */}
                            <AddressComponent
                                value={[]}
                                isSpecial={true}
                                style={[]}
                                placeholder="Chọn địa chỉ"
                                onComplete={(value) => {
                                    if (Array.isArray(value)) {
                                        setState((prevState: IState) => ({
                                            ...prevState,
                                            addressChoose: value,
                                            modalVisibleA: true,
                                            modalVisible: false,
                                        }));
                                    }
                                }}
                            />
                        </View>
                    </View>
                </View>
            </Modal>

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisibleA}
                style={{ zIndex: 99, elevation: 99 }}
            >
                <View style={styles.centeredView}>
                    <TouchableOpacity style={{ flex: 1, }}
                        onPress={() => {
                            setState((prevState: IState) => ({
                                ...prevState,
                                modalVisibleA: false,
                            }));
                        }}
                    >

                    </TouchableOpacity>
                    <View style={[{
                        flex: 1, backgroundColor: '#fff', borderTopLeftRadius: 22, borderTopRightRadius: 22,
                        shadowColor: '#000',
                        shadowOffset: {
                            width: 0,
                            height: 2,
                        },
                        shadowOpacity: 0.25,
                        shadowRadius: 4,
                        elevation: 5,
                    },]}>
                        <View style={{ padding: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Text style={[StylesTheme.text16]}>Nhập tên dường, số nhà</Text>
                            <Pressable
                                style={[{ padding: 12 }]}
                                onPress={() => {
                                    setState((prevState: IState) => ({
                                        ...prevState,
                                        modalVisibleA: false,
                                    }));
                                }}>
                                <CloseIcon size={16} color='#000' />
                            </Pressable>
                        </View>

                        <View style={{ padding: 12, }}>
                            <View>
                                <Text style={StylesTheme.text16}>Số nhà, tên đường</Text>
                            </View>
                            <TextInput
                                style={[{ padding: 12, paddingVertical: 16, fontSize: 14, borderBottomColor: '#ccc', borderBottomWidth: 0.5 }]}
                                placeholder={"Vui lòng nhập!"}
                                value={addressDetail.value}
                                onChangeText={(text) => {
                                    setState((prevState: IState) => ({
                                        ...prevState,
                                        addressDetail: {
                                            ...prevState.addressDetail,
                                            value: text,
                                            isRefresh: !prevState.addressDetail?.isRefresh
                                        }
                                    }));
                                }}
                            />
                        </View>

                        <View style={{ paddingHorizontal: 12, }}>
                            <TouchableOpacity style={{ backgroundColor: Colors.primaryColor, paddingVertical: 12, paddingHorizontal: 20, justifyContent: 'center', alignItems: 'center' }}
                                onPress={() => {
                                    if (addressChoose?.length === 3) {
                                        const temp = [...addressChoose, { code: '99999', name: addressDetail?.value }];

                                        setState((prevState: IState) => ({
                                            ...prevState,
                                            listDeliveryAddress: prevState?.listDeliveryAddress ? [temp, ...prevState?.listDeliveryAddress] : [],
                                            addressChoose: [],
                                            modalVisibleA: false,
                                            modalVisible: true,
                                            addressDetail: ''
                                        }));
                                    }
                                }}
                            >
                                <Text>Hoàn tất</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    componentDisplay: {
        height: 50,
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottomWidth: 1,
        borderBottomColor: "#ccc",
        paddingVertical: 12,
        backgroundColor: 'red'
    },

    centeredView: {
        flex: 1,
        marginTop: 22,
    },
    modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2,
    },
    buttonOpen: {
        backgroundColor: '#F194FF',
    },
    buttonClose: {
        backgroundColor: '#2196F3',
    },
    textStyle: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    modalText: {
        marginBottom: 15,
        textAlign: 'center',
    },
    asteriskValid: {
        color: 'red',
        marginLeft: 6
    },
    textInput: {
        flex: 1,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderColor: '#ccc',
        fontSize: 18,
        fontWeight: '500',
    },
    textSubTitle: {
        color: Colors.colorGrey,
        fontWeight: '500',
    },
});

export default Order;