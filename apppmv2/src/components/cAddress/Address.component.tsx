import React, { useCallback, useEffect, useState } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    Modal,
    SafeAreaView,
    FlatList,
    ActivityIndicator,
    Image
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import StylesTheme from '../../global/theme/Styles.Theme';
import TextInputComponent from '../cTextInput/TextInput.component';
import { BackIcon, RightArowIcon, WarningIcon, LocationIcon } from '../../global/icon/Icon';
import { Colors } from '../../global/theme/Colors.Theme';
import HttpService from '../../service/HttpService.Service';
import { LoadingService } from '../cLoading/Loading.component';
import ItemAddressComponent from './Item.Address.component';
import ItemSelectedAddressComponent from './ItemSelected.Address.component';
import { ENUM } from '../../global/enum';
import ListItemAddressComponent from './ListItemAddress.component';
import { env } from '../../utils/env.utils';

const DATA = [
    {
        id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
        title: 'First Item',
    },
    {
        id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
        title: 'Second Item',
    },
    {
        id: '58694a0f-3da1-471f-bd96-145571e29d72',
        title: 'Third Item',
    },
];

interface IProps {
    value?: any[];
    placeholder?: string;
    style?: any;
    isObligatory?: boolean,
    isShowIconError?: boolean,
    isError?: boolean,
    isSpecial?: boolean,
    onComplete: (value: any) => void,
    // also contains all props of the TextInput component
}

export type Address = {
    code?: string;
    code_name?: string;
    full_name?: string;
    name?: string;
    full_name_en?: string;
    name_en?: string;
    administrative_unit_id?: number;
    isSelect?: boolean;
}

export type Province = Address & {
    administrative_region_id?: number;
};

export type District = Address;

export type Ward = Address;

const valueDefaultProvince = {
    _id: "",
    code: "",
    isDeleted: false,
    name: "",
    name_with_type: "",
    slug: "",
    type: "",
};

type State = {
    search?: string;
    provinces?: {
        value?: Province,
        data?: Province[],
        isFocus?: boolean,
        totalPages?: number,
        totalItems?: number,
        page?: number;
        pageSize?: number;
        isRefresh?: boolean,
    },
    districts?: {
        value?: District,
        data?: District[],
        isFocus?: boolean,
        totalPages?: number,
        totalItems?: number,
        page?: number;
        pageSize?: number;
        isRefresh?: boolean,
    },
    wards?: {
        value?: Ward,
        data?: Ward[],
        isFocus?: boolean,
        totalPages?: number,
        totalItems?: number,
        page?: number;
        pageSize?: number;
        isRefresh?: boolean,
    },
    isShowModal?: boolean,
    isLoading?: boolean,
    dataSource?: any,
    valueView?: any
}

const initialState: State = {
    search: "",
    provinces: {
        value: {},
        data: [],
        isFocus: true,
        totalPages: 0,
        totalItems: 0,
        page: 1,
        pageSize: 20,
        isRefresh: false,
    },
    districts: {
        value: {},
        data: [],
        isFocus: false,
        totalPages: 0,
        totalItems: 0,
        page: 1,
        pageSize: 20,
        isRefresh: false,
    },
    wards: {
        value: {},
        data: [],
        isFocus: false,
        totalPages: 0,
        totalItems: 0,
        page: 1,
        pageSize: 20,
        isRefresh: false,
    },
    isShowModal: false,
    isLoading: false,
    dataSource: null,
    valueView: null,
};

let callOnEndReached: boolean = false,
    endLoading: boolean = false;

const Address: React.FC<IProps> = (props: IProps) => {
    const { value, placeholder, style, isObligatory, isShowIconError, isError, isSpecial, onComplete } = props;
    const cols: string = "name,name_with_type";
    const [{ search, provinces, districts, wards, isShowModal, isLoading, dataSource, valueView }, setState] = useState<State>({ ...initialState });
    // let listData = new Array(26).fill([]);
    // const headerArray = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];

    const handleGetDataProvince = () => {
        debugger
        try {
            HttpService.Get(`${env.URL}/provinces/getProvinces/?search=${search}`, {
                'page': provinces?.page ? provinces?.page : 1,
                'pageSize': provinces?.pageSize ? provinces?.pageSize : 20,
            })
                .then((res: any) => {
                    console.log(`${env.URL}/provinces/getProvinces/?search=${search}`, {
                        'page': provinces?.page ? provinces?.page : 1,
                        'pageSize': provinces?.pageSize ? provinces?.pageSize : 20,
                    }, res, 'res');

                    callOnEndReached = false;
                    const nameData: [] = res?.data;
                    // nameData.sort(function (a: any, b: any) {
                    //     return a.name.toUpperCase() < b.name.toUpperCase()
                    //         ? -1
                    //         : a.name > b.name
                    //             ? 1
                    //             : 0;
                    // });

                    // headerArray.forEach((header, index) => {
                    //     nameData.forEach((item: any) => {
                    //         const headerText = item.name.split("")[0].toUpperCase();
                    //         if (header == headerText) {
                    //             listData[index] = [...listData[index], item];
                    //         }
                    //     });
                    // });

                    if (res && res?.status === 200 && res?.statusText == ENUM.E_SUCCESS && Array.isArray(res?.data)) {
                        let nextState = {};
                        if (provinces?.page === 1) {
                            nextState = {
                                ...nextState,
                                totalItems: res?.totalItem ? res?.totalItem : 0,
                                totalPages: res?.totalPage ? res?.totalPage : 0,
                            }
                        }

                        if ((provinces?.page && provinces?.totalPages && provinces?.page === provinces?.totalPages) || res?.totalPage === 1) {
                            endLoading = true;
                        }

                        setState((prevState: State) => ({
                            ...prevState,
                            provinces: {
                                ...prevState.provinces,
                                isFocus: true,
                                data: provinces?.page ? provinces?.page === 1 ? res?.data : prevState.provinces?.data?.concat(res?.data) : [],
                                ...nextState,
                                isRefresh: !prevState.provinces?.isRefresh
                            },
                            isLoading: false,
                            dataSource: provinces?.page ? provinces?.page === 1 ? res?.data : prevState.provinces?.data?.concat(res?.data) : [],
                        }));
                    } else {
                        setState((prevState: State) => ({
                            ...prevState,
                            provinces: {
                                ...prevState.provinces,
                                isFocus: true,
                                data: [],
                                isRefresh: !prevState.provinces?.isRefresh
                            },
                            isLoading: false,
                            dataSource: [],
                        }));
                    }
                });
        } catch (error) {
            setState((prevState: State) => ({
                ...prevState,
                isLoading: false,
                dataSource: [],
            }));
        }
    };

    useEffect(() => {
        if (isShowModal && provinces?.isFocus && value?.length === 0 && !dataSource)
            handleGetDataProvince();
        else if (isLoading && isShowModal) {
            setState((prevState: State) => ({
                ...prevState,
                isLoading: false,
            }))
        }
    }, [isShowModal]);

    useEffect(() => {
        if (provinces?.page && provinces?.totalPages && provinces?.page <= provinces?.totalPages && provinces?.isFocus) {
            handleGetDataProvince();
        }
    }, [provinces?.page]);

    const handleGetDataDistrictsByProvince = () => {
        try {
            if (provinces?.value?.code) {
                HttpService.Get(`${env.URL}/districts/getDistricts?provinceCode=${provinces?.value?.code}&search=${search}`,
                    {
                        'page': districts?.page ? districts?.page : 1,
                        'pageSize': districts?.pageSize ? districts?.pageSize : 20,
                    }
                )
                    .then((res: any) => {
                        callOnEndReached = false;
                        if (res && res?.status === 200 && res?.statusText == ENUM.E_SUCCESS && Array.isArray(res?.data)) {
                            let nextState = {};
                            if (districts?.page === 1) {
                                nextState = {
                                    ...nextState,
                                    totalItems: res?.totalItem ? res?.totalItem : 0,
                                    totalPages: res?.totalPage ? res?.totalPage : 0,
                                }
                            }

                            if ((districts?.page && districts?.totalPages && districts?.page === districts?.totalPages) || res?.totalPage === 1) {
                                endLoading = true;
                            }

                            setState((prevState: State) => ({
                                ...prevState,
                                districts: {
                                    ...prevState.districts,
                                    isFocus: true,
                                    data: districts?.page ? districts.page === 1 ? res?.data : prevState.districts?.data?.concat(res?.data) : [],
                                    ...nextState,
                                    isRefresh: prevState.districts?.isRefresh
                                },
                                isLoading: false,
                                dataSource: districts?.page ? districts.page === 1 ? res?.data : prevState.districts?.data?.concat(res?.data) : [],
                            }));
                        } else {
                            setState((prevState: State) => ({
                                ...prevState,
                                districts: {
                                    ...prevState.districts,
                                    isFocus: true,
                                    data: [],
                                    isRefresh: prevState.districts?.isRefresh
                                },
                                isLoading: false,
                                dataSource: [],
                            }));
                        }
                    });
            }
        } catch (error) {
            setState((prevState: State) => ({
                ...prevState,
                isLoading: false,
                dataSource: [],
            }));
        }
    }

    useEffect(() => {
        if (districts?.isFocus)
            handleGetDataDistrictsByProvince();
    }, [provinces?.value, districts?.page]);

    const handleGetDataWardByDistrict = () => {
        try {
            if (districts?.value?.code) {
                HttpService.Get(`${env.URL}/wards/getWards?districtCode=${districts?.value?.code}&search=${search}`,
                    {
                        'page': wards?.page ? wards?.page : 1,
                        'pageSize': wards?.pageSize ? wards?.pageSize : 20,
                    }
                )
                    .then((res: any) => {
                        callOnEndReached = false;
                        if (res && res?.status === 200 && res?.statusText == ENUM.E_SUCCESS && Array.isArray(res?.data)) {
                            let nextState = {};
                            if (wards?.page === 1) {
                                nextState = {
                                    ...nextState,
                                    totalItems: res?.totalItem ? res?.totalItem : 0,
                                    totalPages: res?.totalPage ? res?.totalPage : 0,
                                }
                            }

                            if ((wards?.page && wards?.totalPages && wards?.page === wards?.totalPages) || res?.totalPage === 1) {
                                endLoading = true;
                            }
                            setState((prevState: State) => ({
                                ...prevState,
                                wards: {
                                    ...prevState.wards,
                                    isFocus: true,
                                    data: wards?.page ? wards.page === 1 ? res?.data : prevState.wards?.data?.concat(res?.data) : [],
                                    ...nextState,
                                    isRefresh: prevState.wards?.isRefresh
                                },
                                isLoading: false,
                                dataSource: wards?.page ? wards.page === 1 ? res?.data : prevState.wards?.data?.concat(res?.data) : [],
                            }));
                        } else {
                            setState((prevState: State) => ({
                                ...prevState,
                                wards: {
                                    ...prevState.wards,
                                    isFocus: true,
                                    data: [],
                                    isRefresh: prevState.wards?.isRefresh
                                },
                                isLoading: false,
                                dataSource: [],
                            }));
                        }
                    });
            }
        } catch (error) {
            setState((prevState: State) => ({
                ...prevState,
                isLoading: false,
                dataSource: [],
            }));
        }
    }

    useEffect(() => {
        if (wards?.isFocus)
            handleGetDataWardByDistrict();
    }, [districts?.value, wards?.page])

    const handleChooseProvince = useCallback((value?: Province) => {

        callOnEndReached = false;
        if (provinces?.data && Array.isArray(provinces?.data)) {
            provinces?.data.forEach((element: Province) => {
                if (element.code === value?.code)
                    element.isSelect = true;
                else
                    element.isSelect = false;
            })
        }

        setState((prevState: State) => ({
            ...prevState,
            provinces: {
                ...prevState.provinces,
                isFocus: false,
                value: value,
                isRefresh: !prevState.provinces?.isRefresh
            },
            districts: {
                ...prevState.districts,
                isFocus: true,
                value: {},
            },
            wards: {
                ...prevState.wards,
                isFocus: false,
                value: {},
            },
            isLoading: true,
            dataSource: [],
        }));
    }, [provinces?.page, provinces?.totalPages, provinces?.isFocus]);

    const handleChooseDistrict = useCallback((value?: District) => {
        callOnEndReached = false;
        if (districts?.data && Array.isArray(districts?.data)) {
            districts?.data.forEach((element: District) => {
                if (element.code === value?.code)
                    element.isSelect = true;
                else
                    element.isSelect = false;
            })
        }

        setState((prevState: State) => ({
            ...prevState,
            provinces: {
                ...prevState.provinces,
                isFocus: false,
            },
            districts: {
                ...prevState.districts,
                isFocus: false,
                value: value,
                isRefresh: !prevState.districts?.isRefresh
            },
            wards: {
                ...prevState.wards,
                isFocus: true,
                value: {},
            },
            isLoading: true,
            dataSource: [],
        }));
    }, [provinces?.value]);

    const handleChooseWard = useCallback((value?: Ward) => {
        callOnEndReached = false;
        if (wards?.data && Array.isArray(wards?.data)) {
            wards?.data.forEach((element: Ward) => {
                if (element.code === value?.code)
                    element.isSelect = true;
                else
                    element.isSelect = false;
            })
        }

        setState((prevState: State) => ({
            ...prevState,
            provinces: {
                ...prevState.provinces,
                isFocus: false,
            },
            districts: {
                ...prevState.districts,
                isFocus: false,
            },
            wards: {
                ...prevState.wards,
                isFocus: true,
                value: value,
                isRefresh: !prevState.wards?.isRefresh
            },
            isShowModal: false,
        }));
    }, [districts?.value]);

    useEffect(() => {
        if ((wards?.value && Object.keys(wards?.value).length > 0)
            && (provinces?.value && Object.keys(provinces?.value).length > 0)
            && (districts?.value && Object.keys(districts?.value).length > 0)) {
            onComplete([provinces?.value, districts?.value, wards?.value]);
        }
    }, [wards?.value]);

    const handleOnFocusProvince = () => {
        callOnEndReached = false;
        setState((prevState: State) => ({
            ...prevState,
            provinces: {
                ...prevState.provinces,
                isFocus: true,
            },
            districts: {
                ...prevState.districts,
                isFocus: false,
            },
            wards: {
                ...prevState.wards,
                isFocus: false,
            },
            dataSource: prevState.provinces?.data ? prevState.provinces?.data : null,
            isLoading: prevState.provinces?.data ? false : true,
            search: '',
        }));
    };

    const handleOnFocusDistrict = () => {
        callOnEndReached = false;
        setState((prevState: State) => ({
            ...prevState,
            provinces: {
                ...prevState.provinces,
                isFocus: false,
            },
            districts: {
                ...prevState.districts,
                isFocus: true,
            },
            wards: {
                ...prevState.wards,
                isFocus: false,
            },
            dataSource: prevState.districts?.data ? prevState.districts?.data : null,
            isLoading: prevState.districts?.data ? false : true,
            search: '',
        }));
    };

    const handleOnFocusWard = () => {
        callOnEndReached = false;
        setState((prevState: State) => ({
            ...prevState,
            provinces: {
                ...prevState.provinces,
                isFocus: false,
            },
            districts: {
                ...prevState.districts,
                isFocus: false,
            },
            wards: {
                ...prevState.wards,
                isFocus: true,
            },
            dataSource: prevState.wards?.data ? prevState.wards?.data : null,
            isLoading: prevState.wards?.data ? false : true,
            search: '',
        }));
    }

    const setPagesForProvinces = useCallback(() => {
        debugger
        if (provinces?.isFocus) {
            if (provinces?.page && provinces?.totalPages && provinces?.page < provinces?.totalPages) {
                setState((prevState: State) => ({
                    ...prevState,
                    provinces: {
                        ...prevState.provinces,
                        page: provinces?.page ? provinces?.page + 1 : 1,
                    },
                }))
            }
        } else if (districts?.isFocus) {
            if (districts?.page && districts?.totalPages && districts?.page < districts?.totalPages) {
                setState((prevState: State) => ({
                    ...prevState,
                    districts: {
                        ...prevState.districts,
                        page: prevState.districts?.page ? prevState.districts?.page + 1 : 1,
                    },
                }))
            }
        } else if (wards?.isFocus) {
            if (wards?.page && wards?.totalPages && wards?.page < wards?.totalPages) {
                setState((prevState: State) => ({
                    ...prevState,
                    wards: {
                        ...prevState.wards,
                        page: prevState.wards?.page ? prevState.wards?.page + 1 : 1,
                    },
                }))
            }
        }
    }, [provinces?.page, provinces?.totalPages, districts?.page, districts?.totalPages, wards?.page, wards?.totalPages, provinces?.isFocus, districts?.isFocus, wards?.isFocus])

    useEffect(() => {
        if (value && value.length > 0) {
            if (value.length === 3) {
                setState((prevState: State) => ({
                    ...prevState,
                    valueView: `${value[2]?.full_name}, ${value[1]?.full_name}, ${value[0]?.full_name}`
                }));
            } else if (value.length === 2) {
                setState((prevState: State) => ({
                    ...prevState,
                    valueView: `${value[1]?.full_name}, ${value[0]?.full_name}`
                }));
            } else if (value.length === 1) {
                setState((prevState: State) => ({
                    ...prevState,
                    valueView: `${value[0]?.full_name}`
                }));
            }
        }
    }, [value]);

    const handleReset = useCallback(() => {
        endLoading = false;
        if (provinces?.data) {
            provinces?.data.forEach((element: Province) => {
                element.isSelect = false;
            })
        }
        setState((prevState: State) => ({
            ...prevState,
            ...initialState,
            isShowModal: true,
            provinces: {
                ...prevState.provinces,
                value: {}
            },
            dataSource: provinces?.data ? provinces?.data : [],
            valueView: null,
        }));
    }, []);

    // call api when search
    useEffect(() => {
        if (isShowModal) {
            if (provinces?.isFocus) {
                handleGetDataProvince();
            } else if (districts?.isFocus) {
                handleGetDataDistrictsByProvince();
            } else if (wards?.isFocus) {
                handleGetDataWardByDistrict();
            }
        }
    }, [search]);

    return (
        <View style={{ flex: 1 }}>
            {
                isSpecial ? (
                    <TouchableOpacity style={{ padding: 12, borderColor: '#ccc', borderWidth: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}
                        onPress={() => {
                            setState((prevState: State) => ({
                                ...prevState,
                                isShowModal: true,
                                isLoading: true,
                            }));
                        }}
                    >
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <LocationIcon size={22} color='#000' />
                            <Text numberOfLines={2} style={[StylesTheme.text16, { marginLeft: 12, maxWidth: '90%'}]}>{valueView ? valueView : placeholder}</Text>
                        </View>
                        {
                            !valueView && (
                                <Text style={{ fontSize: 22, fontWeight: '700' }}>+</Text>
                            )
                        }
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity style={[styles.componentDisplay, { ...style, paddingHorizontal: 8 }, isError && { borderBottomColor: 'red' }]}
                        onPress={() => {
                            setState((prevState: State) => ({
                                ...prevState,
                                isShowModal: true,
                                isLoading: true,
                            }));
                        }}
                    >
                        <Text numberOfLines={3} style={[StylesTheme.text16, !valueView && [StylesTheme.text14, { color: "#ccc" }], { maxWidth: '90%' }]}>{valueView ? valueView : placeholder}</Text>
                        {
                            isError && isShowIconError ? (
                                <WarningIcon size={28} color='red' />
                            ) : (
                                <RightArowIcon color={Colors.primaryColor} size={16} />
                            )
                        }
                    </TouchableOpacity>
                )
            }
            {
                isShowModal && (
                    <View style={StylesTheme.flexCenter}>
                        <Modal
                            animationType="slide"
                            transparent={true}
                            visible={isShowModal}
                        >
                            <SafeAreaView style={styles.wrapInsideModal}>
                                <View style={styles.wrapSearchInsideModal}>
                                    <TouchableOpacity
                                        style={{ marginRight: 12 }}
                                        onPress={() => {
                                            if (wards?.value && Object.keys(wards?.value).length === 0
                                                && provinces?.value && Object.keys(provinces?.value).length > 0
                                                && districts?.value && Object.keys(districts?.value).length > 0) {
                                                onComplete([provinces?.value, districts?.value]);
                                            } else if (wards?.value && Object.keys(wards?.value).length === 0
                                                && provinces?.value && Object.keys(provinces?.value).length > 0
                                                && districts?.value && Object.keys(districts?.value).length === 0) {
                                                onComplete([provinces?.value]);
                                            }
                                            setState((prevState: State) => ({
                                                ...prevState,
                                                // ...initialState,
                                                isShowModal: false,
                                            }));
                                        }}
                                    >
                                        <BackIcon color={Colors.primaryColor} size={22} />
                                    </TouchableOpacity>
                                    <TextInputComponent
                                        style={[styles.textInput]}
                                        placeholder="Tìm kiếm"
                                        value={search}
                                        onComplete={(text: string) => {
                                            endLoading = false;
                                            setState((prevState: State) => ({
                                                ...prevState,
                                                search: text,
                                                isLoading: true,
                                            }));
                                        }}
                                        isClose={true}
                                    />
                                </View>
                                <View style={{ flex: 1, }}>
                                    <View style={[styles.regionSubtitle, provinces?.value && { backgroundColor: Colors.clWhite }]}>
                                        <View style={StylesTheme.onlyFlexRow_AliCenter_JusSP}>
                                            <Text style={[StylesTheme.textBasic, { color: Colors.colorGrey }]}>Khu vực đã chọn</Text>
                                            <TouchableOpacity
                                                onPress={handleReset}
                                            >
                                                <Text style={[StylesTheme.textBasic, { color: 'red' }]}>Thiết lập lại</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                    <View style={{ backgroundColor: Colors.clWhite, paddingHorizontal: 12 }}>
                                        <View style={styles.straight} />
                                        {
                                            provinces?.value && Object.keys(provinces?.value).length > 0 ? (
                                                <View>
                                                    <ItemSelectedAddressComponent value={provinces?.value} isHaveValue={true}
                                                        isFocus={provinces?.isFocus}
                                                        isRefresh={provinces?.isRefresh}
                                                        onFocus={() => {
                                                            handleOnFocusProvince();
                                                        }}
                                                    />
                                                    {
                                                        districts?.value && Object.keys(districts?.value).length > 0 ? (
                                                            <View>
                                                                <ItemSelectedAddressComponent value={districts?.value} isHaveValue={true}
                                                                    isFocus={districts?.isFocus}
                                                                    isRefresh={districts?.isRefresh}
                                                                    onFocus={() => {
                                                                        handleOnFocusDistrict();
                                                                    }}
                                                                />
                                                                {
                                                                    wards?.value && Object.keys(wards?.value).length > 0 ? (
                                                                        <ItemSelectedAddressComponent value={wards?.value} isHaveValue={true}
                                                                            isFocus={wards?.isFocus}
                                                                            isRefresh={wards?.isRefresh}
                                                                            onFocus={() => {
                                                                                handleOnFocusWard();
                                                                            }}
                                                                        />
                                                                    ) : (
                                                                        <ItemSelectedAddressComponent
                                                                            value={{
                                                                                full_name: "Chọn phường/xã"
                                                                            }}
                                                                            isHaveValue={false}
                                                                            isFocus={wards?.isFocus}
                                                                            isRefresh={wards?.isRefresh}
                                                                            onFocus={() => handleOnFocusWard()}
                                                                        />
                                                                    )
                                                                }
                                                            </View>
                                                        ) : (
                                                            <ItemSelectedAddressComponent
                                                                value={{
                                                                    full_name: "Chọn quận/huyện"
                                                                }}
                                                                isHaveValue={false}
                                                                isFocus={districts?.isFocus}
                                                                isRefresh={districts?.isRefresh}
                                                                onFocus={() => handleOnFocusDistrict()}
                                                            />
                                                        )
                                                    }
                                                </View>
                                            ) : (
                                                <ItemSelectedAddressComponent value={{
                                                    full_name: "Chọn tỉnh/thành phố"
                                                }} isHaveValue={false} />
                                            )
                                        }
                                    </View>
                                    <View style={styles.wrapListItem}>
                                        {
                                            isLoading ? (
                                                <View style={StylesTheme.flexCenter}>
                                                    <ActivityIndicator size={"large"} color={Colors.primaryColor} />
                                                </View>
                                            ) : (
                                                // dataSource && Array.isArray(dataSource) && dataSource.length > 0 ? (
                                                //     <FlatList
                                                //         data={dataSource}
                                                //         ListFooterComponent={() => {
                                                //             return (
                                                //                 <View style={{ paddingVertical: 20 }}>
                                                //                     {
                                                //                         callOnEndReached && (
                                                //                             <ActivityIndicator size={"large"} color={Colors.primaryColor} />
                                                //                         )
                                                //                     }
                                                //                 </View>
                                                //             )
                                                //         }}
                                                //         renderItem={({ item, index }: { item: Address, index: number }) => {
                                                //             return (
                                                //                 <ItemAddressComponent key={index} value={item} onChooseItem={(value?: Province | District | Ward) => {
                                                //                     if (value) {
                                                //                         if (provinces?.isFocus || (!districts?.isFocus && !wards?.isFocus)) {
                                                //                             handleChooseProvince(value);
                                                //                         }
                                                //                         else if (districts?.isFocus) {
                                                //                             handleChooseDistrict(value);
                                                //                         }
                                                //                         else if (wards?.isFocus) {
                                                //                             handleChooseWard(value);
                                                //                         }
                                                //                     }
                                                //                 }} />
                                                //             )
                                                //         }}
                                                //         keyExtractor={(item: Address) => item.code}
                                                //         onMomentumScrollEnd={() => {
                                                //             // if (callOnEndReached && !endLoading) {
                                                //             //     endLoading = true;
                                                //             //     callOnEndReached = false;
                                                //             // }
                                                //         }}
                                                //         onEndReached={aa => {
                                                //             if (!callOnEndReached && search === "") {
                                                //                 callOnEndReached = true;
                                                //                 setPagesForProvinces();
                                                //             }
                                                //         }} // refresh khi scroll den cuoi
                                                //         onEndReachedThreshold={0}
                                                //     />
                                                // ) : (
                                                //     <View style={StylesTheme.flexCenter}>
                                                //         <Image source={require("../../global/assets/image/no-data.png")} style={{ width: 70, height: 70 }} />
                                                //         <Text>Không tìm thấy dữ liệu phù hợp!</Text>
                                                //     </View>
                                                // )
                                                <ListItemAddressComponent
                                                    dataSource={dataSource}
                                                    isFocusP={typeof provinces?.isFocus === 'boolean' ? provinces?.isFocus : false}
                                                    isFocusD={typeof districts?.isFocus === 'boolean' ? districts?.isFocus : false}
                                                    isFocusW={typeof wards?.isFocus === 'boolean' ? wards?.isFocus : false}
                                                    isEndList={endLoading}
                                                    onChooseProvince={(value) => {
                                                        handleChooseProvince(value);
                                                    }}
                                                    onChooseDistrict={(value) => {
                                                        handleChooseDistrict(value);
                                                    }}
                                                    onChooseWard={(value) => {
                                                        handleChooseWard(value);
                                                    }}
                                                    onSetPagesForProvinces={setPagesForProvinces}
                                                />
                                            )
                                        }
                                    </View>
                                </View>
                            </SafeAreaView>
                        </Modal>
                    </View>
                )
            }
        </View>
    )
};

const styles = StyleSheet.create({
    componentDisplay: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },

    textInput: {
        paddingVertical: 12,
        paddingLeft: 14,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 24,
        fontSize: 16,
        fontWeight: '500',
    },

    wrapInsideModal: {
        flex: 1,
        backgroundColor: Colors.clWhite
    },

    wrapSearchInsideModal: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingRight: 24,
        height: 70
    },

    regionSubtitle: {
        paddingVertical: 12,
        paddingHorizontal: 12,
        backgroundColor: '#ebebeb'
    },

    straight: {
        position: 'absolute',
        top: 40,
        bottom: 0,
        left: 30,
        backgroundColor: '#ccc',
        width: 1,
    },

    wrapListItem: {
        flex: 1,
        backgroundColor: Colors.clWhite,
        marginTop: 12,
        paddingLeft: 12,
    }
})

export default React.memo(Address);