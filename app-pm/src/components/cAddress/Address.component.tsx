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
import { BackIcon, RightArowIcon } from '../../global/icon/Icon';
import { Colors } from '../../global/theme/Colors.Theme';
import HttpService from '../../service/HttpService.Service';
import { LoadingService } from '../cLoading/Loading.component';
import ItemAddressComponent from './Item.Address.component';
import ItemSelectedAddressComponent from './ItemSelected.Address.component';

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
    value?: any;
    placeholder?: string;
    style?: any;
    onComplete: (value: any) => void,
    // also contains all props of the TextInput component
}

type Address = {
    _id?: string;
    code?: string;
    isDeleted?: boolean;
    name?: string;
    name_with_type?: string;
    slug?: string;
    type?: string;
    isSelect?: boolean;
}

export type Province = Address;

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
    page?: number;
    limit?: number;
    provinces?: {
        value?: Province | any,
        data?: Province[] | any,
        isFocus?: boolean,
        isRefresh?: boolean,
    },
    districts?: {
        value?: District | any,
        data?: District[] | any,
        isFocus?: boolean,
        isRefresh?: boolean,
    },
    wards?: {
        value?: Ward | any,
        data?: Ward[] | any,
        isFocus?: boolean,
        isRefresh?: boolean,
    },
    isShowModal?: boolean,
    isLoading?: boolean,
    dataSource?: any,
}

const initialState: State = {
    search: "",
    page: 1,
    limit: 20,
    provinces: {
        value: null,
        data: null,
        isFocus: false,
        isRefresh: false,
    },
    districts: {
        value: null,
        data: null,
        isFocus: false,
        isRefresh: false,
    },
    wards: {
        value: null,
        data: null,
        isFocus: false,
        isRefresh: false,
    },
    isShowModal: false,
    isLoading: false,
    dataSource: null,
};

const Address: React.FC<IProps> = (props: IProps) => {
    const { value, placeholder, style, onComplete } = props;
    const isHaveValue = value && value !== "" ? true : false;
    const cols: string = "name,name_with_type";
    const [{ search, page, limit, provinces, districts, wards, isShowModal, isLoading, dataSource }, setState] = useState<State>({ ...initialState });
    // let listData = new Array(26).fill([]);
    // const headerArray = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];

    const handleGetDataProvince = () => {
        try {
            HttpService.Get(`https://vn-public-apis.fpo.vn/provinces/getAll?getAll?q=${search}&cols=${cols}&page=${page}&limit=${limit}`)
                .then((res: any) => {
                    const nameData: [] = res?.data?.data;
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
                    // console.log(listData, 'listData');

                    if (res && res?.exitcode == 1 && Array.isArray(res?.data?.data)) {
                        setState((prevState: State) => ({
                            ...prevState,
                            provinces: {
                                ...prevState.provinces,
                                data: res?.data?.data,
                                isRefresh: !prevState.provinces?.isRefresh
                            },
                            isLoading: false,
                            dataSource: res?.data?.data,
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
        if (isShowModal)
            handleGetDataProvince();
    }, [isShowModal]);

    const handleGetDataDistrictsByProvince = () => {
        try {
            if (provinces?.value?.code) {
                HttpService.Get(`https://vn-public-apis.fpo.vn/districts/getByProvince?provinceCode=${provinces?.value?.code}&q=${search}&cols=${cols}&page=${page}&limit=${limit}`)
                    .then((res: any) => {
                        if (res && res?.exitcode == 1 && Array.isArray(res?.data?.data)) {
                            setState((prevState: State) => ({
                                ...prevState,
                                districts: {
                                    ...prevState.districts,
                                    data: res?.data?.data,
                                    isRefresh: prevState.districts?.isRefresh
                                },
                                isLoading: false,
                                dataSource: res?.data?.data
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
    }, [provinces?.value]);

    const handleGetDataWardByDistrict = () => {
        try {
            if (districts?.value?.code) {
                HttpService.Get(`https://vn-public-apis.fpo.vn/wards/getByDistrict?districtCode=${districts?.value?.code}&q=${search}&cols=${cols}&page=${page}&limit=${limit}`)
                    .then((res: any) => {
                        if (res && res?.exitcode == 1 && Array.isArray(res?.data?.data)) {
                            setState((prevState: State) => ({
                                ...prevState,
                                wards: {
                                    ...prevState.wards,
                                    data: res?.data?.data,
                                    isRefresh: prevState.wards?.isRefresh
                                },
                                isLoading: false,
                                dataSource: res?.data?.data
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
    }, [districts?.value])

    const handleChooseProvince = (value?: Province) => {
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
                value: null,
            },
            wards: {
                ...prevState.wards,
                isFocus: false,
                value: null,
            },
            isLoading: true,
            page: 1,
            limit: 20,
            dataSource: [],
        }));
    };

    const handleChooseDistrict = (value?: District) => {
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
                value: null,
            },
            isLoading: true,
            page: 1,
            limit: 20,
            dataSource: [],
        }));
    }

    const handleChooseWard = (value?: Ward) => {
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
        }));
    }

    const handleOnFocusProvince = () => {
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
            page: 1,
            limit: 20,
            search: '',
        }));
    };

    const handleOnFocusDistrict = () => {
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
            page: 1,
            limit: 20,
            search: '',
        }));
    };

    const handleOnFocusWard = () => {
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
            page: 1,
            limit: 20,
            search: '',
        }));
    }

    return (
        <View style={{ flex: 1 }}>
            <TouchableOpacity style={[styles.componentDisplay, { ...style }]}
                onPress={() => {
                    setState((prevState: State) => ({
                        ...prevState,
                        isShowModal: true,
                        isLoading: true,
                    }));
                }}
            >
                <Text style={[StylesTheme.text14, !isHaveValue && { color: "#ccc" }]}>{isHaveValue ? value : placeholder}</Text>
                <RightArowIcon color={Colors.primaryColor} size={16} />
            </TouchableOpacity>
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
                                            setState((prevState: State) => ({
                                                ...prevState,
                                                ...initialState,
                                                isShowModal: false,
                                            }));
                                        }}
                                    >
                                        <BackIcon color={Colors.primaryColor} size={22} />
                                    </TouchableOpacity>
                                    <TextInputComponent
                                        style={[styles.textInput, {}]}
                                        placeholder="Tìm kiếm"
                                        value={search}
                                        onComplete={(text) => {

                                        }}
                                        isClose={false}
                                    />
                                </View>
                                <View style={{ flex: 1, }}>
                                    <View style={[styles.regionSubtitle, provinces?.value && { backgroundColor: Colors.clWhite }]}>
                                        <View style={StylesTheme.onlyFlexRow_AliCenter_JusSP}>
                                            <Text style={[StylesTheme.textBasic, { color: Colors.colorGrey }]}>Khu vực đã chọn</Text>
                                            <TouchableOpacity>
                                                <Text style={[StylesTheme.textBasic, { color: 'red' }]}>Thiết lập lại</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                    <View style={{ backgroundColor: Colors.clWhite, paddingHorizontal: 12 }}>
                                        <View style={styles.straight} />
                                        {
                                            provinces?.value ? (
                                                <View>
                                                    <ItemSelectedAddressComponent value={provinces?.value} isHaveValue={true}
                                                        isFocus={provinces?.isFocus}
                                                        isRefresh={provinces?.isRefresh}
                                                        onFocus={() => {
                                                            handleOnFocusProvince();
                                                        }}
                                                    />
                                                    {
                                                        districts?.value ? (
                                                            <View>
                                                                <ItemSelectedAddressComponent value={districts?.value} isHaveValue={true}
                                                                    isFocus={districts?.isFocus}
                                                                    isRefresh={districts?.isRefresh}
                                                                    onFocus={() => {
                                                                        handleOnFocusDistrict();
                                                                    }}
                                                                />
                                                                {
                                                                    wards?.value ? (
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
                                                                                name: "Chọn phường/xã"
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
                                                                    name: "Chọn quận/huyện"
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
                                                    name: "Chọn tỉnh/thành phố"
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
                                                dataSource && Array.isArray(dataSource) && dataSource.length > 0 ? (
                                                    <FlatList
                                                        data={dataSource}
                                                        renderItem={({ item, index }: { item: Province, index: number }) => {
                                                            return (
                                                                <ItemAddressComponent key={index} value={item} onChooseItem={(value?: Province | District | Ward) => {
                                                                    if (value) {
                                                                        if (provinces?.isFocus || (!districts?.isFocus && !wards?.isFocus)) {
                                                                            handleChooseProvince(value);
                                                                        }
                                                                        else if (districts?.isFocus) {
                                                                            handleChooseDistrict(value);
                                                                        }
                                                                        else if (wards?.isFocus) {
                                                                            handleChooseWard(value);
                                                                        }
                                                                    }
                                                                }} />
                                                            )
                                                        }}
                                                        keyExtractor={(item: Province) => item._id}
                                                    />
                                                ) : (
                                                    <View style={StylesTheme.flexCenter}>
                                                        <Image source={require("../../global/assets/image/no-data.png")} style={{ width: 70, height: 70 }} />
                                                        <Text>Không tìm thấy dữ liệu phù hợp!</Text>
                                                    </View>
                                                )
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
        flex: 1,
        paddingVertical: 20,
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