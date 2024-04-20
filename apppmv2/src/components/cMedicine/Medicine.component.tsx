import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions, Pressable, Modal } from 'react-native';

import { Product } from '../../type/Product.type';
import StylesTheme from '../../global/theme/Styles.Theme';
import { useNavigation } from '@react-navigation/native';
import { MainStackParams, RootStackParams } from '../../navigation/Stack.Navigator';
import { StackNavigationProp } from '@react-navigation/stack';
import { CloseIcon } from '../../global/icon/Icon';
import { AlertService } from '../cAlert/Alert.component';
import { LoadingService } from '../cLoading/Loading.component';
import { ENUM } from '../../global/enum';
import HttpService from '../../service/HttpService.Service';
import { env } from '../../utils/env.utils';
import Function from '../../global/assets/service/Function.Service';
import OptionChooseQuickly from '../cOptionChooseQuickly/OptionChooseQuickly.component';
import { Colors } from '../../global/theme/Colors.Theme';
import { useAppDispatch, useAppSelector } from '../../redux/reduxHook.redux';
import { CartStore, addItemIntoCart, setDataCount } from '../../redux/cart-slice.redux';

const { width } = Dimensions.get('window');

const widthDefault = width > 400 ? (width * 45) / 100 : (width * 44) / 100;
const fontSizeDefault = width > 400 ? 16 : 13;

interface IProps {
    item?: any;
    colorBtn?: any;
    mgBottom?: any;
    handleClickProduct?: any;
}

interface IState {
    modalVisible?: boolean,
    unitProduct?: any,
    lsUnit?: any[],
}

const initialState: IState = {
    modalVisible: false,
    unitProduct: null,
    lsUnit: [],
};

const Medicine: React.FC<IProps> = (props: IProps) => {
    const navigation = useNavigation<StackNavigationProp<RootStackParams>>();
    const [{ modalVisible, unitProduct, lsUnit }, setState] = useState<IState>({ ...initialState });
    const { item, colorBtn, mgBottom, handleClickProduct } = props;
    let unitView: any[] = [];
    const data: {
        listItemCart: any[],
        dataCount: {
            countCart?: number,
            coutnBillWaitingConfirm?: number,
            countBillConfirmed?: number,
            countBillDelivering?: number,
            countBillCanceled?: number,
            totalCountInBill?: number,
        }
    } = useAppSelector(CartStore);
    const dispatch = useAppDispatch();

    if (item?.medicineDetail?.unitView && item?.medicineDetail?.unitView.length > 0) {
        const arrUnitView = JSON.parse(item?.medicineDetail?.unitView);
        if (Array.isArray(arrUnitView)) {
            arrUnitView.map((value: any) => {
                if (value?.isHave && value?.name) {
                    unitView.push(value?.name);
                }
            })
        }
    }

    const handleAddProductIntoCart = async () => {
        try {
            if (item?.id) {
                if (!unitProduct?.code) {
                    AlertService.show(ENUM.E_ERROR, 'Vui lòng chọn đơn vị mua', 3000, "Không thành công");
                    return;
                }
                let dataBody = {
                    params: [
                        {
                            id: item?.id,
                            quantity: 1,
                            unitPurchase: unitProduct?.code,
                        }
                    ],
                    isSaveNew: true,
                    isIncrease: true,
                };
                LoadingService.show()
                const profile: any = await Function.getAppData(ENUM.KEY_IN4USER);

                if (profile?.id) {
                    HttpService.Post(`${env.URL}/medicine/addToCart`, {
                        ...dataBody
                    }, {
                        profileid: profile?.id
                    }).then((res: any) => {
                        LoadingService.hide();
                        if (res?.status !== 201 && res?.status !== 200) {
                            AlertService.show(ENUM.E_ERROR, res?.message ? res?.message : 'Không thành công!', 3000, null);
                            setState((prevState: IState) => ({
                                ...prevState,
                                modalVisible: false
                            }));
                            return;
                        }

                        let countInCart = data?.dataCount?.countCart ? data?.dataCount?.countCart : 0;

                        AlertService.show(ENUM.E_SUCCESS, 'Thêm thành công!', 3000, null);

                        // save to redux state
                        dispatch(setDataCount({ ...data.dataCount, countCart: [...data.listItemCart, dataBody.params].length + countInCart }));
                        dispatch(addItemIntoCart(dataBody.params));

                        setState((prevState: IState) => ({
                            ...prevState,
                            modalVisible: false,
                        }));

                    }).catch((error) => {
                        LoadingService.hide();
                        console.log(error, 'error');
                        // handle screen error
                    })
                }
            }
        } catch (error) {
            console.log(error, 'error');
            // handle screen error
        }
    };

    useEffect(() => {
        if (Array.isArray(JSON.parse(item?.medicineDetail?.unitView))) {
            setState((prevState: IState) => ({
                ...prevState,
                lsUnit: JSON.parse(item?.medicineDetail?.unitView),
            }));
        }
    }, []);

    return (
        <TouchableOpacity
            style={[styles.container, mgBottom && { marginBottom: mgBottom }]}
            onPress={() => {
                navigation.navigate("DetailMedicine", {
                    item: { ...item }
                });
            }}
        >
            <View style={{ flex: 1, padding: 12, justifyContent: 'flex-start', alignItems: 'center' }}>
                <View style={{ width: '100%', height: '40%' }}>
                    <Image
                        source={{ uri: item?.medicineDetail?.lsImage?.split(',')[0] }}
                        resizeMode={'contain'}
                        style={{ width: '100%', height: '100%' }}
                    />
                </View>
                <View style={{ width: '100%', height: '60%', marginTop: 12, justifyContent: 'space-between' }}>
                    <View>
                        <Text numberOfLines={2}>{item?.fullName}</Text>
                    </View>

                    <View style={{ width: '100%' }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Text style={[StylesTheme.sizeText, { color: 'red', fontWeight: '700' }]}>
                                {
                                    new Intl.NumberFormat('en-US', {
                                        currency: 'VND',
                                        style: 'currency',
                                    }).format(item?.medicineDetail?.price ? item?.medicineDetail?.price : 0).replace('₫', '')
                                }₫
                            </Text>
                            {/* {item?.isPromotion === true ? (
                                <Text
                                    style={[
                                        StylesTheme.sizeText,
                                        { color: '#ccc', textDecorationLine: 'line-through' },
                                    ]}
                                >
                                    {item?.medicineDetail?.price}
                                </Text>
                            ) : null} */}
                        </View>
                        <View style={{ flexDirection: 'row' }}>
                            <Text>Đơn vị tính: </Text>
                            <Text style={{ fontWeight: '600', maxWidth: '50%', }} numberOfLines={1}>
                                {/* {item?.unit?.box === true ? 'Hộp' : null}, {item?.unit?.pill === true ? 'Viên' : null}, */}
                                {unitView.length > 0 ? unitView.join(',') : ''}
                            </Text>
                        </View>
                    </View>

                    <View style={{ width: '100%', alignItems: 'center', marginBottom: 12 }}>
                        <TouchableOpacity
                            style={{
                                backgroundColor: '#41BB2D',
                                padding: 4,
                                borderRadius: 12,
                                width: '100%',
                                alignItems: 'center',
                            }}
                            onPress={() => {
                                setState((prevState: IState) => ({
                                    ...prevState,
                                    modalVisible: true,
                                }));
                            }}
                        >
                            <Text>Thêm vào giỏ hàng</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
            >
                <View style={styles.centeredView}>
                    <TouchableOpacity style={{ flex: 0.7 }}
                        onPress={() => {
                            setState((prevState: IState) => ({
                                ...prevState,
                                modalVisible: false,
                            }));
                        }}
                    >

                    </TouchableOpacity>
                    <View style={{
                        flex: 0.3, backgroundColor: '#fff', borderTopLeftRadius: 22, borderTopRightRadius: 22,
                        shadowColor: '#000',
                        shadowOffset: {
                            width: 0,
                            height: 2,
                        },
                        shadowOpacity: 0.25,
                        shadowRadius: 4,
                        elevation: 5,
                    }}>
                        <View style={{ padding: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Text style={[StylesTheme.text16]}>Chọn đơn vị tính</Text>
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
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 16, }}>
                            <OptionChooseQuickly
                                data={lsUnit}
                                onComplete={(item) => {
                                    setState((prevState: IState) => ({
                                        ...prevState,
                                        unitProduct: item
                                    }));
                                }
                                }
                            />
                        </View>
                        <View style={{ width: '100%', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 16, marginBottom: 20, }}>
                            <TouchableOpacity
                                onPress={() => {
                                    handleAddProductIntoCart();
                                }}
                                style={{ backgroundColor: Colors.primaryColor, paddingVertical: 12, width: '100%', justifyContent: 'center', alignItems: 'center', borderRadius: 8, }}>
                                <Text style={StylesTheme.textLabel}>Xác nhân</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </TouchableOpacity>
    )
};

const styles = StyleSheet.create({
    container: {
        width: widthDefault,
        height: 230,
        backgroundColor: '#fff',
        marginRight: 12,
        borderColor: '#D2D2D2',
        borderWidth: 1,
        borderRadius: 12,
    },

    centeredView: {
        flex: 1,
        marginTop: 22,
    },
});


export default React.memo(Medicine, (prevProps, nextProps) => {
    return Function.compare(prevProps.item, nextProps.item);
});