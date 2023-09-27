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
    Platform
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import TitleHeader from '../../components/cTitleHeader/TitleHeader.component';
import Search from '../../components/cSearch/Search.component';
import DrugStore from '../../components/cDrugStore/DrugStore.component';
import ListMedicine from '../../components/cMedicine/ListMedicine.component';
import SwiperImgMedicine from '../../components/cSwiperImgMedicine/SwiperImgMedicine.component';
import MedicinePortfolio from '../../components/cMedicine/MedicinePortfolio.component';
import { RightArowIcon, BellIcon } from '../../global/icon/Icon';
import { MainStackParams } from '../../navigation/Stack.Navigator';

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

const DATA_PRODUCT_PORTFOLIO = [
    {
        id: 1,
        nameProductPortfolio: 'Thuốc',
        img_icon: 'https://cdn-icons-png.flaticon.com/512/3140/3140343.png',
        api: '',
    },
    {
        id: 2,
        nameProductPortfolio: 'Vitamin, thuốc bổ',
        img_icon: 'https://cdn-icons-png.flaticon.com/512/3159/3159960.png',
        api: '',
    },
    {
        id: 3,
        nameProductPortfolio: 'Chăm sóc da',
        img_icon: 'https://cdn-icons-png.flaticon.com/512/4383/4383084.png',
        api: '',
    },
    {
        id: 4,
        nameProductPortfolio: 'Chăm sóc cơ thể',
        img_icon: 'https://cdn-icons-png.flaticon.com/512/3023/3023711.png',
        api: '',
    },
    {
        id: 5,
        nameProductPortfolio: 'Tăng cường trí nhớ',
        img_icon: 'https://cdn-icons-png.flaticon.com/512/2491/2491325.png',
        api: '',
    },
    {
        id: 6,
        nameProductPortfolio: 'Tăng cường sinh lý',
        img_icon: 'https://cdn-icons-png.flaticon.com/512/1019/1019174.png',
        api: '',
    },
    {
        id: 7,
        nameProductPortfolio: 'Sản phẩm',
        img_icon: 'https://cdn-icons-png.flaticon.com/512/4076/4076123.png',
    },
];

const DATA_PRODUCT = [
    {
        id: 1,
        nameProduct: 'Thuốc đau đầu',
        priceCourse: '455000',
        pricePromotion: '550000',
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
        id: 2,
        nameProduct: 'Thuốc đau chân',
        priceCourse: '455000',
        pricePromotion: '553400',
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
        id: 3,
        nameProduct: 'Thuốc đau tay',
        priceCourse: '455000',
        pricePromotion: '585000',
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
        id: 4,
        nameProduct: 'Thuốc đau bụng',
        priceCourse: '455000',
        pricePromotion: '534000',
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
        id: 5,
        nameProduct: 'Thuốc đau răng',
        priceCourse: '455000',
        pricePromotion: '550330',
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

const { width } = Dimensions.get('window');

interface IState {
    valueSearch?: string;
    isShowHeader?: boolean;
}

const initialState: IState = {
    valueSearch: '',
    isShowHeader: false,
};

const Home: React.FC = () => {

    const navigation = useNavigation<StackNavigationProp<MainStackParams>>();
    const [{ valueSearch, isShowHeader }, setState] = useState<IState>({ ...initialState });

    const handleScroll = useCallback((value: any) => {
        if (value >= 130) {
            if (isShowHeader === false) {
                setState({
                    isShowHeader: true,
                });
            }
        } else {
            if (isShowHeader === true) {
                setState({
                    isShowHeader: false,
                });
            }
        }
    }, []);

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.wrapBgRadius}>
                <View style={styles.bgRadiusTop}></View>
            </View>
            {isShowHeader ? (
                <View
                    style={{
                        flex: 1,
                        position: 'absolute',
                        width: '100%',
                        height: Platform.OS === 'android' ? 85 : 100,
                        zIndex: 1,
                        elevation: 1,
                        paddingTop: Platform.OS === 'android' ? 16 : 32,
                        backgroundColor: '#5BC57E',
                        paddingHorizontal: 12,
                    }}
                >
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <View
                            style={{
                                position: 'absolute',
                                left: 0,
                                zIndex: 1,
                                elevation: 1,
                            }}
                        >
                            <TouchableOpacity>
                                <Image
                                    source={require('../../global/assets/image/menu-button-of-three-horizontal-lines.png')}
                                    style={{ width: 32, height: 32 }}
                                />
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
            ) : null}

            <ScrollView
                style={styles.wrapContent}
                horizontal={false}
                onScroll={(event) => {
                    handleScroll(event.nativeEvent.contentOffset.y);
                }}
                scrollEventThrottle={120}
            >
                <View
                    style={[
                        {
                            flex: 0.1,
                        },
                    ]}
                >
                    {!isShowHeader ? <TitleHeader /> : null}
                </View>
                <View style={[{ flex: 0.1, marginVertical: 12 }]}>
                    {!isShowHeader ? (
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
                    ) : null}
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
                        <View style={styles.productPortfolio}>
                            <View style={{}}>
                                <Text style={styles.fs16fw500}>Danh mục sản phẩm </Text>
                            </View>
                            <View style={styles.listProductPortfolio}>
                                {DATA_PRODUCT_PORTFOLIO.map((item) => {
                                    return <MedicinePortfolio key={item.id} data={item} />;
                                })}
                            </View>
                        </View>

                        {/* sản phẩm khuyến mãi */}
                        <View style={styles.listProductRow}>
                            <View style={styles.flexDCenter}>
                                <Text style={styles.fs16fw500}>Sản phẩm khuyến mãi</Text>
                                <TouchableOpacity
                                    style={{ flexDirection: 'row', alignItems: 'center' }}
                                    onPress={() => {
                                        // navigation.navigate('PM_AllProduct', {
                                        //     api: {
                                        //         urlApi: 'https://63eeef46c59531ccf166864a.mockapi.io/api/todo/tasks',
                                        //     },
                                        // });
                                    }
                                    }
                                >
                                    <Text style={[styles.fs16fw500, { color: 'blue' }]}>Xem tất cả</Text>
                                    <RightArowIcon color="blue" size={16} />
                                </TouchableOpacity>
                            </View>
                            <View style={styles.listProduct}>
                                <ListMedicine
                                    data={DATA_PRODUCT}
                                    isHorizontal={true}
                                    api={{
                                        urlApi: 'https://63eeef46c59531ccf166864a.mockapi.io/api/todo/tasks',
                                    }}
                                />
                            </View>
                        </View>

                        {/* sản phẩm bán chạy */}
                        <View style={[styles.listProductRow, { marginTop: 12 }]}>
                            <View style={styles.flexDCenter}>
                                <Text style={styles.fs16fw500}>Sản phẩm bán chạy</Text>
                                <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Text style={[styles.fs16fw500, { color: 'blue' }]}>Xem tất cả</Text>
                                    <RightArowIcon color="blue" size={16} />
                                </TouchableOpacity>
                            </View>
                            <View style={styles.listProduct}>
                                <ListMedicine
                                    data={DATA_PRODUCT}
                                    isHorizontal={true}
                                    api={{
                                        urlApi: 'https://63eeef46c59531ccf166864a.mockapi.io/api/todo/tasks',
                                    }}
                                />
                            </View>
                        </View>

                        {/* Gợi ý hôm nay */}
                        <View style={[styles.listProductRow, { marginTop: 12 }]}>
                            <View style={styles.flexDCenter}>
                                <Text style={styles.fs16fw500}>Gợi ý hôm nay</Text>
                            </View>
                            <View style={[styles.listProductPortfolio, styles.listProduct]}>
                                <ListMedicine
                                    data={DATA_PRODUCT}
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