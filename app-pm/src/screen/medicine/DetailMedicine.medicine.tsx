import React, { useCallback, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    Dimensions,
    FlatList,
    ScrollView,
    ActivityIndicator,
    SafeAreaView,
    Animated,
    StatusBar,
    Pressable,
    Modal,
    Platform,
} from 'react-native';
import Swiper from 'react-native-swiper';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import { Product } from '../../type/Product.type';
import StylesTheme from '../../global/theme/Styles.Theme';
import { BackIcon, CartIcon } from '../../global/icon/Icon';
import Function from '../../service/Function.Service';
import QuantityComponent from '../../components/cQuantity/Quantity.component';
import Evaluate from './tabView/Evaluate.TabView';
import Describe from './tabView/Describe.TabView';
import ListMedicineComponent from '../../components/cMedicine/ListMedicine.component';
import RadioButton from '../../components/cRadioButton/RadioButton.component';
import OptionChooseQuickly from '../../components/cOptionChooseQuickly/OptionChooseQuickly.component';
import { AlertService } from '../../components/cAlert/Alert.component';
import { useNavigation, useRoute } from '@react-navigation/native';
import { CloseIcon } from '../../global/icon/Icon';
import { StackNavigationProp } from '@react-navigation/stack';
import { MainStackParams } from '../../navigation/Stack.Navigator';
import PickerQuicklyComponent from '../../components/cPickerQuickly/PickerQuickly.component';
import { TypeDefault } from '../../type/Type';
import { LoadingService } from '../../components/cLoading/Loading.component';

const DATA_SWIPER = [
    {
        id: 1,
        img: 'https://cdn.nhathuoclongchau.com.vn/unsafe/fit-in/1600x400/filters:quality(100):fill(white)/https://nhathuoclongchau.com.vn/upload/slide/1680418566-Ijvp-bo-sung-dinh-duong.png',
    },
    {
        id: 2,
        img: 'https://cdn.nhathuoclongchau.com.vn/unsafe/fit-in/1600x400/filters:quality(100):fill(white)/https://nhathuoclongchau.com.vn/upload/slide/1679725085-Ha7S-phong-benh-sot-xuat-huyet.png',
    },
    {
        id: 3,
        img: 'https://cdn.nhathuoclongchau.com.vn/unsafe/fit-in/1600x400/filters:quality(100):fill(white)/https://nhathuoclongchau.com.vn/upload/slide/1679301962-G74I-san-pham-lam-dep.jpg',
    },
    {
        id: 4,
        img: 'https://cdn.nhathuoclongchau.com.vn/unsafe/fit-in/1600x400/filters:quality(100):fill(white)/https://nhathuoclongchau.com.vn/upload/slide/1678849994-9Ilx-fmcg-t3-2023.jpg',
    },
    {
        id: 5,
        img: 'https://cdn.nhathuoclongchau.com.vn/unsafe/fit-in/1600x400/filters:quality(100):fill(white)/https://nhathuoclongchau.com.vn/upload/slide/1678700509-NBeS-kem-chong-nang-2023.png',
    },
];

const { width, height } = Dimensions.get('window');

const DEFAUlT_SIZE_PADDINGHORIZONTAL = width > 410 ? 18 : 12;

interface IProps {
    item: Product,
}

type Params = {
    item?: any;
}

type valueProduct = {
    name?: string;
    price?: number;
    unit?: string;
    quantity?: number;
    isRefresh?: boolean;
}

interface IState {
    index?: number;
    isShowHeader?: boolean,
    isActiveWhich?: boolean,
    isShowModalDeliveryForm?: boolean,
    deliveryForm?: TypeDefault,
    dataDefault?: any[
    // {
    //     id?: string,
    //     label?: string,
    //     isChecked?: boolean,
    // }
    ],
    listProductInCart?: any[],
    unitProduct?: any,
    product?: valueProduct
}

const initialState: IState = {
    index: 0,
    isShowHeader: false,
    isActiveWhich: false,
    isShowModalDeliveryForm: false,
    deliveryForm: {
        value: null,
        data: [
            {
                id: '1',
                name: 'Nhận tại cửa hàng'
            },
            {
                id: '2',
                name: 'Giao hàng Online'
            }
        ],
        isRefresh: false
    },
    dataDefault: [
        {
            id: "1",
            label: 'Giao hàng',
            isChecked: true,
        },
        {
            id: "2",
            label: 'Nhận hàng trực tiếp',
            isChecked: false,
        }
    ],
    listProductInCart: [],
    unitProduct: null,
    product: {
        name: '',
        price: 0,
        quantity: 1,
        unit: '',
        isRefresh: false,
    }
};

const DetailMedicine: React.FC = () => {
    const route = useRoute();
    const { item } = route.params;
    const navigation = useNavigation<StackNavigationProp<MainStackParams>>();
    const [{ dataDefault, index, isActiveWhich, isShowHeader, isShowModalDeliveryForm,
        deliveryForm, listProductInCart, unitProduct, product
    }, setState] = useState<IState>({ ...initialState });

    const handleScroll = (value: any) => {
        if (value >= height / 2 - 50) {
            if (isShowHeader === false) {
                setState((prevState: IState) => ({
                    ...prevState,
                    isShowHeader: true,
                }));
            }
        } else {
            if (isShowHeader === true) {
                setState((prevState: IState) => ({
                    ...prevState,
                    isShowHeader: false,
                }));
            }
        }
    };

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

    const handleShowModal = () => {
        setState((prevState: IState) => ({
            ...prevState,
            isShowModalDeliveryForm: true,
        }));
    };

    const handleCloseModal = () => {
        setState((prevState: IState) => ({
            ...prevState,
            isShowModalDeliveryForm: false,
        }));
    };
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

    const handleAddProductIntoCart = () => {
        const data = {
            id: Function.generateUUID(),
            nameProduct: item?.name,
            priceCourse: 199000,
            pricePromotion: 199000,
            isPromotion: item.isPromotion,
            unit: unitProduct,
            imgProduct: item.imgProduct,
            createdAt: Date.now(),
        };
        setState((prevState: IState) => ({
            ...prevState,
            listProductInCart: listProductInCart ? [...listProductInCart, data] : [data],
        }));
    };

    const handleQuantityPurchase = useCallback((value: number) => {
        if (value) {
            setState((prevState: IState) => ({
                ...prevState,
                product: {
                    ...prevState.product,
                    quantity: value
                }
            }));
        }
    }, []);

    return (
        <SafeAreaView style={[styles.container, StylesTheme.droidSafeArea, { backgroundColor: '#fff' }]}>
            <View
                style={[
                    {
                        position: 'absolute',
                        width: '100%',
                        top: Platform.OS === 'android' ? 12 : 50,
                        zIndex: 1,
                    },
                    isShowHeader && styles.headerActive,
                ]}
            >
                <View
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        paddingHorizontal: 24,
                    }}
                >
                    <TouchableOpacity
                        style={{ padding: 12, backgroundColor: '#e0e0e0', borderRadius: 12 }}
                        onPress={() => {
                            navigation.goBack();
                        }}
                    >
                        <BackIcon size={26} color={'#000'} />
                    </TouchableOpacity>
                    {isShowHeader ? (
                        <View style={{ maxWidth: '60%' }}>
                            <Text style={[styles.text]} numberOfLines={1}>
                                {item?.name}
                            </Text>
                        </View>
                    ) : null}
                    <TouchableOpacity style={{ padding: 12, backgroundColor: '#e0e0e0', borderRadius: 12 }}>
                        {listProductInCart !== null &&
                            Array.isArray(listProductInCart) &&
                            listProductInCart.length > 0 ? (
                            <View style={styles.quantityCart}>
                                <Text style={{ fontSize: 18, fontWeight: '700' }}>{listProductInCart.length}</Text>
                            </View>
                        ) : null}
                        <CartIcon size={26} color={'#000'} />
                    </TouchableOpacity>
                </View>
            </View>

            <ScrollView
                style={[styles.container, StylesTheme.droidSafeArea, { backgroundColor: '#fff' }]}
                onScroll={(event) => {
                    handleScroll(event.nativeEvent.contentOffset.y);
                }}
                scrollEventThrottle={120}
            >
                <KeyboardAwareScrollView style={{ flex: 1 }}>
                    {/* IMG */}
                    <View style={styles.wrapImgProduct}>
                        <Swiper
                            key={DATA_SWIPER.length}
                            // style={styles.wrapper}
                            showsButtons={false}
                            loop={true}
                            autoplay={true}
                            dot={
                                <View
                                    style={{
                                        backgroundColor: 'black',
                                        width: 8,
                                        height: 8,
                                        borderRadius: 7,
                                        marginLeft: 7,
                                        marginRight: 7,
                                    }}
                                />
                            }
                            activeDot={
                                <View
                                    style={{
                                        backgroundColor: 'red',
                                        width: 10,
                                        height: 10,
                                        borderRadius: 7,
                                        marginLeft: 7,
                                        marginRight: 7,
                                    }}
                                />
                            }
                            paginationStyle={{
                                bottom: 10,
                            }}
                        >
                            {/* {DATA_SWIPER.map((item) => {
                            return (
                                <View style={styles.slide} key={item.id}>
                                    <Image
                                        source={{
                                            uri: 'https://cdn.nhathuoclongchau.com.vn/unsafe/fit-in/1600x400/filters:quality(100):fill(white)/https://nhathuoclongchau.com.vn/upload/slide/1680418566-Ijvp-bo-sung-dinh-duong.png',
                                        }}
                                        resizeMode={'contain'}
                                        style={styles.image}
                                    />
                                </View>
                            );
                        })} */}
                            <View style={styles.slide}>
                                <Image
                                    source={{ uri: 'https://cdn.youmed.vn/tin-tuc/wp-content/uploads/2021/03/new-vrohto.jpg' }}
                                    resizeMode={'contain'}
                                    style={styles.image}
                                />
                            </View>
                            <View style={styles.slide}>
                                <Image
                                    source={{ uri: 'https://cdn.youmed.vn/tin-tuc/wp-content/uploads/2021/03/new-vrohto.jpg' }}
                                    resizeMode={'contain'}
                                    style={styles.image}
                                />
                            </View>
                        </Swiper>
                    </View>

                    {/* Content */}
                    <View style={styles.wrapContent}>
                        <View style={styles.in4MainProduct}>
                            <Text style={[styles.text]}>{item?.name}</Text>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={[styles.text, { color: '#5BC57E', fontSize: 22, marginRight: 12 }]}>
                                    199.000 đ / chai
                                </Text>
                                <Text
                                    style={[
                                        styles.text,
                                        { color: '#ccc', fontSize: 22, textDecorationLine: 'line-through' },
                                    ]}
                                >
                                    199.000 đ / chai
                                </Text>
                            </View>
                            <Text style={[styles.text, { fontSize: 16 }]}>Số luợng còn: 100</Text>
                            {/* Chọn đơn vị tính */}
                            <View>
                                <OptionChooseQuickly
                                    data={Array.isArray(item.unit) ? item.unit : []}
                                    onComplete={(item) =>
                                        setState((prevState: IState) => ({
                                            ...prevState,
                                            unitProduct: item,
                                        }))
                                    }
                                />
                            </View>
                            {/* Số lượng mua */}
                            <View style={{ marginVertical: 12 }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Text style={[styles.text, {}]}>Số lượng mua</Text>
                                    <QuantityComponent
                                        value={product?.quantity}
                                        limit={100}
                                        onComplete={(value: number) => {
                                            handleQuantityPurchase(value);
                                        }}
                                    />
                                </View>
                            </View>
                        </View>
                        <View
                            style={[
                                styles.in4MainProduct,
                                { height: 10, backgroundColor: '#e0e0e0', width: '100%', padding: 0 },
                            ]}
                        ></View>
                        {/* hinh thuc nhan hang va chi phi van chuyen*/}
                        <View style={[styles.in4MainProduct]}>
                            {/* hinh thuc nhan hang */}
                            <View style={{ marginVertical: 16 }}>
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

                            {/* chi phi van chuyen */}
                            <View>
                                <View style={StylesTheme.onlyFlexRow_AliCenter_JusSP}>
                                    <View style={{ width: '50%', alignItems: 'flex-start' }}>
                                        <Text numberOfLines={2} style={[StylesTheme.text16]}>Chi phí vận chuyển: </Text>
                                    </View>
                                    <View style={{ width: '50%', alignItems: 'flex-end' }}>
                                        <Text numberOfLines={2} style={[StylesTheme.text16]}> 12.000đ - 22.000đ</Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                        {/* 

                    {/* Mo ta, danh gia */}
                        <View style={[styles.in4MainProduct, { padding: 0 }]}>
                            {/* <Describe /> */}
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
                                                Mô tả
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
                                                Đánh giá
                                            </Text>
                                        </Pressable>
                                    </View>
                                </View>

                                {/* content tab view */}
                                <View style={styles.contentTabView}>
                                    {!isActiveWhich ? <Describe /> : <Evaluate />}
                                </View>
                            </View>
                        </View>
                        {/* Sản phẩm tương tự */}
                        <View style={{ flex: 1, backgroundColor: '#fff' }}>
                            <View
                                style={{
                                    flexDirection: 'row',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    marginVertical: 24,
                                }}
                            >
                                <View style={{ width: '20%', height: 1, backgroundColor: '#ccc' }} />
                                <Text
                                    style={{
                                        fontSize: 18,
                                        fontWeight: '600',
                                        fontStyle: 'italic',
                                        marginHorizontal: 12,
                                    }}
                                >
                                    Sản phẩm tương tự
                                </Text>
                                <View style={{ width: '20%', height: 1, backgroundColor: '#ccc' }} />
                            </View>

                            {/* sản phẩm */}
                            <View style={[styles.listProductPortfolio, styles.listProduct, { paddingLeft: 12 }]}>
                                <ListMedicineComponent
                                    isHorizontal={false}
                                    isNumColumn={true}
                                    numColumn={2}
                                    colorBtn={'#d9c129'}
                                    api={{
                                        urlApi: 'https://63eeef46c59531ccf166864a.mockapi.io/api/todo/tasks',
                                    }}
                                />
                            </View>
                        </View>
                    </View>
                </KeyboardAwareScrollView>
            </ScrollView>

            {/* button mua ngay và thêm vào giỏ hàng */}
            <View style={{ position: 'absolute', width: '100%', bottom: 0, zIndex: 1 }}>
                <View
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        paddingHorizontal: 16,
                        backgroundColor: '#fff',
                        paddingBottom: 24,
                        paddingTop: 12,
                        borderTopWidth: 0.5,
                        borderTopColor: '#ccc',
                    }}
                >
                    <TouchableOpacity
                        style={{
                            borderColor: '#5BC57E',
                            borderWidth: 1,
                            borderRadius: 8,
                            paddingHorizontal: DEFAUlT_SIZE_PADDINGHORIZONTAL,
                        }}
                    >
                        <Text style={[styles.text]}>Mua ngay</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            borderColor: '#ccc',
                            borderWidth: 1,
                            borderRadius: 8,
                            paddingHorizontal: DEFAUlT_SIZE_PADDINGHORIZONTAL,
                            backgroundColor: '#5BC57E',
                        }}
                        onPress={() => handleAddProductIntoCart()}
                    >
                        <CartIcon size={26} color={'#000'} />
                        <Text style={[styles.text, { marginLeft: 12 }]}>Thêm vào giỏ hàng</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
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
        flex: 1,
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

export default DetailMedicine;
