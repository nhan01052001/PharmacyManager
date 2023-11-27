import { useNavigation } from '@react-navigation/core';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useCallback, useRef, useState } from 'react';
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
import { MainStackParams } from '../../navigation/Stack.Navigator';

import { HeaderComponent } from '../../components/cHeadder/Header.Component';
import Search from '../../components/cSearch/Search.component';
import ListMedicineComponent from '../../components/cMedicine/ListMedicine.component';
import { Product } from '../../type/Product.type';

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


const AllMedicine: React.FC = () => {
    const navigation = useNavigation<StackNavigationProp<MainStackParams>>();
    const scrollListReftop = useRef<any>();
    const [{ valueSearch, isShowHeader, portfolios,
        products, promotionalProducts, bestSellingProducts, recommendTodayProduct
    }, setState] = useState<IState>({ ...initialState });

    return (
        <View style={{ flex: 1 }}>
            <HeaderComponent
                titleHeader={''}
                isOptionHome={false}
                goBack={() => navigation.goBack()}
            />
            <ScrollView
                style={{ paddingBottom: 24, flex: 1 }}
                ref={scrollListReftop}
            >
                <View
                    style={{
                        flex: 1,
                        flexDirection: 'row',
                        padding: 12,
                        alignItems: 'center',
                        justifyContent: 'flex-start',
                    }}
                >
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
                    <TouchableOpacity style={{ padding: 8, marginLeft: 12 }}>
                        {/* <Image source={require('../../assets/filter.png')} style={{ width: 32, height: 32 }} /> */}
                    </TouchableOpacity>
                </View>
                <View
                    style={[
                        styles.listProductPortfolio,
                        styles.listProduct,
                        { paddingLeft: 14, paddingTop: 0, marginTop: 12 },
                    ]}
                >
                    <ListMedicineComponent
                        data={[]}
                        isHorizontal={false}
                        isNumColumn={true}
                        numColumn={2}
                        colorBtn={'#d9c129'}
                        api={{
                            urlApi: 'https://63eeef46c59531ccf166864a.mockapi.io/api/todo/tasks',
                        }}
                        isRefresh={promotionalProducts?.isRefresh}
                    />
                </View>
            </ScrollView>

            <View style={{ position: 'absolute', bottom: 24, right: 24 }}>
                <TouchableOpacity
                    style={{
                        padding: 12,
                        borderRadius: 32,
                        borderColor: '#ccc',
                        borderWidth: 1,
                        backgroundColor: '#fff',
                    }}
                    onPress={() => scrollListReftop.current.scrollTo({ x: 0, y: 0, animated: true })}
                >
                    {/* <Image source={require('../../assets/go-up.png')} style={{ width: 32, height: 32 }} /> */}
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    listProductPortfolio: {
        marginVertical: 4,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'flex-start',
    },

    listProduct: {
        marginVertical: 16,
    },
});

export default AllMedicine;