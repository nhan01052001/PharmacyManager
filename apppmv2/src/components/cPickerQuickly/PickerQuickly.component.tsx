import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal, Pressable, FlatList, ActivityIndicator } from 'react-native';

import Function from '../../service/Function.Service';
import StylesTheme, { height } from '../../global/theme/Styles.Theme';
import { RightArowIcon } from '../../global/icon/Icon';
import ItemComponent from './Item.component';
import HttpService from '../../service/HttpService.Service';
import { Colors } from '../../global/theme/Colors.Theme';

interface IProps {
    value?: any;
    label?: string;
    data?: any[];
    isRefresh?: boolean;
    style?: any;
    api?: {
        url: string;
        type: string;
        dataBody?: any;
    };
    isDataLocal?: boolean;
    fieldDisplay?: string;
    onFinish: (value: any) => void;
}

interface IState {
    dataLocal: any[];
    isShowModal: boolean;
    isLoading?: boolean;
    itemSelected?: any;
}

const initialState: IState = {
    dataLocal: [],
    isShowModal: false,
    isLoading: true,
    itemSelected: null,

};

const PickerQuickly: React.FC<IProps> = (props: IProps) => {
    const { label, value, data, style, api, isDataLocal, fieldDisplay, onFinish } = props;
    const [{ dataLocal, isLoading, isShowModal, itemSelected }, setState] = useState<IState>({ ...initialState });

    const handleCloseModal = () => {
        setState((prevState: IState) => ({
            ...prevState,
            isShowModal: false,
        }));
    };

    const geData = () => {
        try {
            if (api?.type === 'GET') {
                HttpService.Get(api.url).then((res: any) => {
                    if (res?.Status === 'SUCCESS' && Array.isArray(res?.data)) {
                        setState((prevState: IState) => ({
                            ...prevState,
                            dataLocal: [...res?.data],
                            isLoading: false,
                        }));
                    } else {
                        setState((prevState: IState) => ({
                            ...prevState,
                            dataLocal: [],
                            isLoading: false,
                        }));
                    }
                });
            } else if (api?.type === 'POST') {
                HttpService.Post(api.url, {
                    ...api?.dataBody
                }).then((res: any) => {
                    if (res?.Status === 'SUCCESS' && Array.isArray(res?.data)) {
                        setState((prevState: IState) => ({
                            ...prevState,
                            dataLocal: [...res?.data],
                            isLoading: false,
                        }));
                    } else {
                        setState((prevState: IState) => ({
                            ...prevState,
                            dataLocal: [],
                            isLoading: false,
                        }));
                    }
                });
            }
        } catch (error) {
            console.log(error, 'error')
        }
    }

    useEffect(() => {
        if (isShowModal) {
            if (isDataLocal && data) {
                setState((prevState: IState) => ({
                    ...prevState,
                    dataLocal: [...data],
                    isLoading: false,
                }));
            } else if (api) {
                geData();
            } else {
                setState((prevState: IState) => ({
                    ...prevState,
                    dataLocal: [],
                    isLoading: false,
                }));
            }
        }
    }, [isShowModal]);

    const handleChooseItem = (item: any) => {
        if (item) {
            dataLocal.forEach((element) => {
                if (element?.isChecked) {
                    element.isChecked = false;
                }
                if (item?.id === element?.id) {
                    element.isChecked = true;
                }
            });

            setState((prevState: IState) => ({
                ...prevState,
                dataLocal: [...dataLocal],
                isShowModal: false,
                itemSelected: item,
            }));
        }
    }

    useEffect(() => {
        if (value && !dataLocal.find((element) => element?.isChecked === true)) {
            const index = dataLocal.findIndex((element) => element?.id === value?.id);
            if (index < 0) {
                setState((prevState: IState) => ({
                    ...prevState,
                    dataLocal: [{ ...value, isChecked: true }, ...dataLocal],
                }));
            } else {
                dataLocal[index].isChecked = true;
            }
        }
    }, [dataLocal]);

    useEffect(() => {
        if (itemSelected) {
            onFinish(itemSelected);
        }
    }, [itemSelected]);

    console.log('re-render');
    return (
        <View style={{ flex: 1, }}>
            <TouchableOpacity style={[StylesTheme.onlyFlexRow_AliCenter_JusSP, style]} onPress={() => {
                setState((prevState: IState) => ({
                    ...prevState,
                    isShowModal: true,
                    isLoading: true,
                }));
            }}>
                <Text style={[StylesTheme.text16, { maxWidth: '50%' }]}>{label}</Text>
                <View
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        maxWidth: '50%'
                    }}
                >
                    <Text
                        numberOfLines={1}
                        style={[StylesTheme.text16, { marginRight: 6, color: 'red', fontWeight: '600' }]}
                    >
                        {value ? value[`${fieldDisplay}`] : 'Vui lòng chọn'}
                    </Text>
                    <RightArowIcon size={16} color={'#000'} />
                </View>
            </TouchableOpacity>
            <Modal
                animationType="fade"
                transparent={true}
                visible={isShowModal} //isShowModal
                onRequestClose={handleCloseModal}
            >
                <View style={{ flex: 1 }}>
                    <Pressable style={styles.bgOpacity} onPress={() => handleCloseModal()}></Pressable>
                    <View style={styles.wrapContentModal}>
                        <View style={{ flex: 1, padding: 24 }}>
                            <View>
                                <Text style={StylesTheme.textLabel}>Hình thức nhận hàng</Text>
                            </View>
                            {/* content */}
                            <View style={{ flex: 1, marginTop: 24 }}>
                                {
                                    isLoading ? (
                                        <View style={StylesTheme.flexCenter}>
                                            <ActivityIndicator color={Colors.primaryColor} size={'large'} />
                                        </View>
                                    ) : (
                                        dataLocal.length === 0 ? (
                                            <View style={StylesTheme.flexCenter}>
                                                <Text>Không tìm thấy dữ liệu phù hợp!</Text>
                                            </View>
                                        ) : (
                                            <FlatList
                                                data={dataLocal}
                                                renderItem={
                                                    ({ item }) => (
                                                        <ItemComponent
                                                            key={item?.id}
                                                            value={item}
                                                            onComplete={(value) => {
                                                                if (value) {
                                                                    handleChooseItem(value);
                                                                }
                                                            }}
                                                        />
                                                    )}
                                                keyExtractor={(item) => item.id}
                                            />
                                        )
                                    )
                                }
                            </View>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    )
}

const styles = StyleSheet.create({
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
})

export default React.memo(PickerQuickly, (prevProps, nextProps) => {
    if ((prevProps?.isRefresh !== nextProps?.isRefresh)
        || ((prevProps.value !== null || nextProps.value !== null) && Function.compare(prevProps.value, nextProps.value) === false)
    ) {
        return false;
    } else {
        return true;
    }
});