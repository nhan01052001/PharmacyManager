import React, { useCallback, useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    FlatList,
    Dimensions,
    SafeAreaView,
    Image,
    TouchableOpacity,
    Platform,
    Animated
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import TitleHeader from '../../components/cTitleHeader/TitleHeader.component';
import Search from '../../components/cSearch/Search.component';
import DrugStore from '../../components/cDrugStore/DrugStore.component';
import ListMedicine from '../../components/cMedicine/ListMedicine.component';
import SwiperImgMedicine from '../../components/cSwiperImgMedicine/SwiperImgMedicine.component';
import MedicinePortfolio from '../../components/cMedicine/MedicinePortfolio.component';
import { RightArowIcon, BellIcon, CartIcon } from '../../global/icon/Icon';
import { MainStackParams } from '../../navigation/Stack.Navigator';
import StylesTheme, { width, height } from '../../global/theme/Styles.Theme';
import { Product } from '../../type/Product.type';
import { AllStackParams } from '../../navigation/Stack.Navigator';
import { env } from '../../utils/env.utils';

type Portfolio = {
    id: string,
    nameProductPortfolio: string,
    img_icon: string,
    api?: string,
};

type ListPortfolio = {
    dataProductPortfolio?: Portfolio[];
    isRefresh?: boolean;
}

const DATA_SWIPER = [
    {
        id: "1",
        img: 'https://firebasestorage.googleapis.com/v0/b/upload-image-f8fdc.appspot.com/o/Img_Swiper%2Fmain10kpc-1679457098200.png?alt=media&token=7ceffe9d-1aac-4447-8129-a323afe06270&_gl="1"*1jjuzla*_ga*OTYxOTMzMTMwLjE2OTE3NTgzNDU.*_ga_CW55HF8NVT*MTY5NjYxMDM2NC40LjEuMTY5NjYxMDUwNy41My4wLjA.',
    },
    {
        id: "2",
        img: 'https://firebasestorage.googleapis.com/v0/b/upload-image-f8fdc.appspot.com/o/Img_Swiper%2Fcovert3pc-1678260629246.png?alt=media&token=4f1efef4-2d3e-4370-8c0a-d87865ae42e1&_gl=1*103ydpr*_ga*OTYxOTMzMTMwLjE2OTE3NTgzNDU.*_ga_CW55HF8NVT*MTY5NjYxMDM2NC40LjEuMTY5NjYxMDU3Ni42MC4wLjA.',
    },
    {
        id: "3",
        img: 'https://firebasestorage.googleapis.com/v0/b/upload-image-f8fdc.appspot.com/o/Img_Swiper%2FArtboard%205-1678333033361.png?alt=media&token=f0bdfb7d-3571-4a2f-84c0-09ed4226b20c&_gl=1*1atg3nz*_ga*OTYxOTMzMTMwLjE2OTE3NTgzNDU.*_ga_CW55HF8NVT*MTY5NjYxMDM2NC40LjEuMTY5NjYxMDU5Ny4zOS4wLjA.',
    },
    {
        id: "4",
        img: 'https://firebasestorage.googleapis.com/v0/b/upload-image-f8fdc.appspot.com/o/Img_Swiper%2F913x280%20(4)-1678267297741.png?alt=media&token=5e7835b8-1901-4831-8715-63381a81be93&_gl=1*ngnt55*_ga*OTYxOTMzMTMwLjE2OTE3NTgzNDU.*_ga_CW55HF8NVT*MTY5NjYxMDM2NC40LjEuMTY5NjYxMDYyMS4xNS4wLjA.',
    },
    {
        id: "5",
        img: 'https://firebasestorage.googleapis.com/v0/b/upload-image-f8fdc.appspot.com/o/Img_Swiper%2F913x280%20(3)-1678267195605.png?alt=media&token=3a7eec5c-6d4f-4365-ab84-84ac289bde6d&_gl=1*of8dcg*_ga*OTYxOTMzMTMwLjE2OTE3NTgzNDU.*_ga_CW55HF8NVT*MTY5NjYxMDM2NC40LjEuMTY5NjYxMDYzNy42MC4wLjA.',
    },
];

const DATA_PRODUCT_PORTFOLIO = [
    {
        id: "1",
        nameProductPortfolio: 'Thuốc',
        img_icon: 'https://cdn-icons-png.flaticon.com/512/3140/3140343.png',
        api: '',
    },
    {
        id: "2",
        nameProductPortfolio: 'Vitamin, thuốc bổ',
        img_icon: 'https://cdn-icons-png.flaticon.com/512/3159/3159960.png',
        api: '',
    },
    {
        id: "3",
        nameProductPortfolio: 'Chăm sóc da',
        img_icon: 'https://cdn-icons-png.flaticon.com/512/4383/4383084.png',
        api: '',
    },
    {
        id: "4",
        nameProductPortfolio: 'Chăm sóc cơ thể',
        img_icon: 'https://cdn-icons-png.flaticon.com/512/3023/3023711.png',
        api: '',
    },
    {
        id: "5",
        nameProductPortfolio: 'Tăng cường trí nhớ',
        img_icon: 'https://cdn-icons-png.flaticon.com/512/2491/2491325.png',
        api: '',
    },
    {
        id: "6",
        nameProductPortfolio: 'Tăng cường sinh lý',
        img_icon: 'https://cdn-icons-png.flaticon.com/512/1019/1019174.png',
        api: '',
    },
    {
        id: "7",
        nameProductPortfolio: 'Sản phẩm',
        img_icon: 'https://cdn-icons-png.flaticon.com/512/4076/4076123.png',
    },
];

const DATA_PRODUCT = [
    {
        id: "1",
        name: 'Thuốc đau đầu',
        priceCourse: 455000,
        pricePromotion: 550000,
        isPromotion: true,
        unit: {
            box: true,
            pill: true,
            bottle: true,
        },
        imgProduct:
            'https://cdn.nhathuoclongchau.com.vn/unsafe/fit-in/600x600/filters:quality(90):fill(white)/nhathuoclongchau.com.vn/images/product/2019/10/00009742-hapacol-extra-5205-5d9e_large.JPG',
    },
    {
        id: "2",
        name: 'Thuốc đau chân',
        priceCourse: 455000,
        pricePromotion: 553400,
        isPromotion: true,
        unit: {
            box: true,
            pill: true,
            bottle: false,
        },
        imgProduct:
            'https://cdn.nhathuoclongchau.com.vn/unsafe/fit-in/600x600/filters:quality(90):fill(white)/nhathuoclongchau.com.vn/images/product/2022/04/00033763-actadol-500mg-medipharco-10x10-8398-624e_large.jpg',
    },
    {
        id: "3",
        name: 'Thuốc đau tay',
        priceCourse: 455000,
        pricePromotion: 585000,
        isPromotion: true,
        unit: {
            box: true,
            pill: true,
            bottle: false,
        },
        imgProduct:
            'https://cdn.nhathuoclongchau.com.vn/unsafe/fit-in/600x600/filters:quality(90):fill(white)/nhathuoclongchau.com.vn/images/product/2022/09/00501891--7317-631e_large.jpg',
    },
    {
        id: "4",
        name: 'Thuốc đau bụng',
        priceCourse: 455000,
        pricePromotion: 534000,
        isPromotion: true,
        unit: {
            box: true,
            pill: true,
            bottle: false,
        },
        imgProduct:
            'https://cdn.nhathuoclongchau.com.vn/unsafe/fit-in/600x600/filters:quality(90):fill(white)/nhathuoclongchau.com.vn/images/product/2018/07/00002760-elthon-50mg-8703-5b43_large.JPG',
    },
    {
        id: "5",
        name: 'Thuốc đau răng',
        priceCourse: 455000,
        pricePromotion: 550330,
        isPromotion: true,
        unit: {
            box: true,
            pill: true,
            bottle: false,
        },
        imgProduct:
            'https://cdn.nhathuoclongchau.com.vn/unsafe/fit-in/600x600/filters:quality(90):fill(white)/nhathuoclongchau.com.vn/images/product/2021/07/00016538-thuoc-tri-dau-rang-dentanalgi-7ml-opc-2859-6103_large.jpg',
    },
];

const SIZE = 40;
const COLOR = '#000';
const HEIGHT15 = (15 / 100) * height;
const MIN_HEIGHT = 120;
const HEIGHt85 = (85 / 100) * height;
const SIZE_PADDING = Platform.OS === 'android' ? 32 : 48;
const SIZE_ANIMATED = Platform.OS === 'android' ? 85 + SIZE_PADDING : 100 + SIZE_PADDING;

interface IState {
    valueSearch?: string;
    isShowHeader?: boolean;
    portfolios?: ListPortfolio,
    products?: {
        dataProduct?: Product[],
        isRefresh?: boolean,
    },
    promotionalProducts?: {
        data?: Product[],
        isRefresh?: boolean,
    },
    bestSellingProducts?: {
        data?: Product[],
        isRefresh?: boolean,
    },
    recommendTodayProduct?: {
        data?: Product[],
        isRefresh?: boolean,
    }
}

const initialState: IState = {
    valueSearch: '',
    isShowHeader: false,
    portfolios: {
        dataProductPortfolio: DATA_PRODUCT_PORTFOLIO,
        isRefresh: false,
    },
    products: {
        dataProduct: DATA_PRODUCT,
        isRefresh: false,
    },
    promotionalProducts: {
        data: DATA_PRODUCT,
        isRefresh: false,
    },
    bestSellingProducts: {
        data: DATA_PRODUCT,
        isRefresh: false,
    },
    recommendTodayProduct: {
        data: DATA_PRODUCT,
        isRefresh: false,
    }
};

const Home: React.FC = () => {
    const navigation = useNavigation<StackNavigationProp<AllStackParams>>();
    const [{ valueSearch, isShowHeader, portfolios,
        products, promotionalProducts, bestSellingProducts, recommendTodayProduct
    }, setState] = useState<IState>({ ...initialState });
    const animated = new Animated.Value(-SIZE_ANIMATED);
    const duration = 200;

    const handleScroll = (value: number) => {
        if (HEIGHT15 > MIN_HEIGHT) {
            if (value >= HEIGHT15) {
                Animated.timing(animated, {
                    toValue: 0,
                    duration: duration,
                    useNativeDriver: true,
                }).start();
            } else {
                Animated.timing(animated, {
                    toValue: -SIZE_ANIMATED,
                    duration: 200,
                    useNativeDriver: true,
                }).start();
            }
        } else {
            if (value >= MIN_HEIGHT) {
                Animated.timing(animated, {
                    toValue: 0,
                    duration: duration,
                    useNativeDriver: true,
                }).start();
            } else {
                Animated.timing(animated, {
                    toValue: -SIZE_ANIMATED,
                    duration: duration,
                    useNativeDriver: true,
                }).start();
            }
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <Animated.View style={[{ transform: [{ translateY: animated }] }, {
                flex: 1, position: 'absolute', top: 0, right: 0, left: 0, zIndex: 99,
                elevation: 99,
            }]}>
                <View style={{
                    width: '100%',
                    height: Platform.OS === 'android' ? 85 : 100,
                    zIndex: 99,
                    elevation: 99,
                    paddingTop: SIZE_PADDING,
                    backgroundColor: '#5BC57E',
                    paddingHorizontal: 12,
                }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <View
                            style={{
                                position: 'absolute',
                                left: 0,
                                zIndex: 99, elevation: 99
                            }}
                        >
                            <TouchableOpacity
                                onPress={() => {
                                    navigation.navigate('Cart')
                                }}
                            >
                                <CartIcon color='#000' size={36} />
                            </TouchableOpacity>
                        </View>
                        <Search
                            propsValue={valueSearch}
                            propsPlaceholder={'Bạn muốn mua thuốc gì?'}
                            propsOnChangeText={(value: string) =>
                                setState({
                                    valueSearch: value,
                                })
                            }
                            propsStyleWrapTextInput={{ borderRadius: 20, width: '75%' }}
                            propsStyleTextInput={{}}
                            propsMargin={{}}
                        />
                        <View style={{ position: 'absolute', right: 0, zIndex: 1, elevation: 1 }}>
                            <TouchableOpacity>
                                <BellIcon size={36} color={COLOR} />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Animated.View>
            <View style={styles.wrapBgRadius}>
                <View style={[styles.bgRadiusTop]}></View>
            </View>
            <ScrollView
                style={[styles.wrapContent, {
                    zIndex: 1,
                    elevation: 1,
                }]}
                horizontal={false}
                onScroll={(event) => {
                    handleScroll(event.nativeEvent.contentOffset.y);
                }}
                scrollEventThrottle={120}
            >
                <View style={{
                    width: '100%',
                    height: HEIGHT15,
                    minHeight: MIN_HEIGHT,
                }}>
                    <View style={{ flex: 1 }}>
                        <TitleHeader />
                    </View>
                    <View style={[{ flex: 1, }]}>
                        <Search
                            propsValue={valueSearch}
                            propsPlaceholder={'Bạn muốn mua thuốc gì?'}
                            propsOnChangeText={(value: string) =>
                                setState({
                                    valueSearch: value,
                                })
                            }
                            propsStyleWrapTextInput={{ borderRadius: 20 }}
                            propsStyleTextInput={{}}
                            propsMargin={{}}
                        />
                    </View>
                </View>
                <View style={[styles.fl02, { marginVertical: 24 }]}>
                    <DrugStore />
                </View>
                <View style={[styles.fl02, { marginTop: 12 }]}>
                    <SwiperImgMedicine dataImg={DATA_SWIPER} />
                </View>
                <View style={styles.wrapProduct}>
                    <View style={styles.contentProduct}>
                        {/* Danh mục sản phẩm */}
                        {
                            portfolios?.dataProductPortfolio && (
                                <View style={styles.productPortfolio}>
                                    <View style={{}}>
                                        <Text style={styles.fs16fw500}>Danh mục sản phẩm </Text>
                                    </View>
                                    <View style={styles.listProductPortfolio}>
                                        {portfolios.dataProductPortfolio.map((item) => {
                                            return <MedicinePortfolio key={item.id} data={item} isRefresh={portfolios.isRefresh} />;
                                        })}
                                    </View>
                                </View>
                            )
                        }

                        {/* sản phẩm khuyến mãi */}
                        {
                            <View style={styles.listProductRow}>
                                <View style={styles.flexDCenter}>
                                    <Text style={styles.fs16fw500}>Sản phẩm khuyến mãi</Text>
                                    <TouchableOpacity
                                        style={{ flexDirection: 'row', alignItems: 'center' }}
                                        onPress={() => {
                                            navigation.navigate('AllMedicine', {
                                                api: {
                                                    urlApi: `${env.URL}/medicine/findMedicine`,
                                                    configHeader: {
                                                        'page': 1,
                                                        'pageSize': 20,
                                                    }
                                                }
                                            });
                                        }
                                        }
                                    >
                                        <Text style={[styles.fs16fw500, { color: 'blue' }]}>Xem tất cả</Text>
                                        <RightArowIcon color="blue" size={16} />
                                    </TouchableOpacity>
                                </View>
                                <View style={styles.listProduct}>
                                    <ListMedicine
                                        data={[]}
                                        isHorizontal={true}
                                        api={{
                                            urlApi: `${env.URL}/medicine/findMedicine`,
                                            configHeader: {
                                                'page': 1,
                                                'pageSize': 5,
                                            }
                                        }}
                                        isRefresh={promotionalProducts?.isRefresh}
                                    />
                                </View>
                            </View>
                        }

                        {/* sản phẩm bán chạy */}
                        {
                            bestSellingProducts?.data && (
                                <View style={[styles.listProductRow, { marginTop: 12 }]}>
                                    <View style={styles.flexDCenter}>
                                        <Text style={styles.fs16fw500}>Sản phẩm bán chạy</Text>
                                        <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }}
                                            onPress={() => {
                                                navigation.navigate('AllMedicine', {
                                                    api: {
                                                        urlApi: `${env.URL}/medicine/findMedicine`,
                                                        configHeader: {
                                                            'page': 1,
                                                            'pageSize': 20,
                                                        }
                                                    }
                                                });
                                            }
                                            }
                                        >
                                            <Text style={[styles.fs16fw500, { color: 'blue' }]}>Xem tất cả</Text>
                                            <RightArowIcon color="blue" size={16} />
                                        </TouchableOpacity>
                                    </View>
                                    <View style={styles.listProduct}>
                                        <ListMedicine
                                            data={[]}
                                            isHorizontal={true}
                                            api={{
                                                urlApi: `${env.URL}/medicine/findMedicine`,
                                                configHeader: {
                                                    'page': 1,
                                                    'pageSize': 20,
                                                }
                                            }}
                                            isRefresh={bestSellingProducts.isRefresh}
                                        />
                                    </View>
                                </View>
                            )
                        }

                        {/* Gợi ý hôm nay */}
                        {
                            recommendTodayProduct?.data && (
                                <View style={[styles.listProductRow, { marginTop: 12 }]}>
                                    <View style={styles.flexDCenter}>
                                        <Text style={styles.fs16fw500}>Gợi ý hôm nay</Text>
                                    </View>
                                    <View style={[styles.listProductPortfolio, styles.listProduct]}>
                                        <ListMedicine
                                            isHorizontal={false}
                                            isNumColumn={true}
                                            numColumn={2}
                                            colorBtn={'#d9c129'}
                                            api={{
                                                urlApi: `${env.URL}/medicine/findMedicine`,
                                                configHeader: {
                                                    'page': 1,
                                                    'pageSize': 20,
                                                    'typeSort': 'DESC'
                                                }
                                            }}
                                            isRefresh={recommendTodayProduct.isRefresh}
                                        />
                                    </View>
                                </View>
                            )
                        }
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#5BC57E',
        //paddingTop: 30,
    },

    bgRadiusTop: {
        height: '70%',
        width: 660,
        backgroundColor: '#e2d8e6',
        borderTopLeftRadius: 350,
        borderTopRightRadius: 350,
    },

    wrapBgRadius: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-end',
    },

    wrapContent: {
        position: 'absolute',
        height: '100%',
        width: '100%',
        backgroundColor: 'transparent',
        bottom: 0,
    },

    fl02: {
        flex: 0.2,
        alignItems: 'center',
        justifyContent: 'center',
    },

    wrapProduct: {
        flex: 1,
        paddingTop: 24,
    },

    contentProduct: {
        borderTopLeftRadius: 22,
        borderTopRightRadius: 22,
        padding: 16,
        backgroundColor: '#fff',
    },

    productPortfolio: {
        flex: 1,
    },

    listProductPortfolio: {
        marginVertical: 4,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'flex-start',
    },

    listProductRow: {
        flex: 1,
    },

    listProduct: {
        marginVertical: 16,
    },

    flexDCenter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },

    fs16fw500: {
        fontSize: 18,
        fontWeight: '600',
    },

    wrapBtnMenu: {
        position: 'absolute',
        left: 12,
        top: 12,
    },

    wrapBtnNotify: {
        position: 'absolute',
        right: 12,
        top: 8,
    },
});

export default Home;