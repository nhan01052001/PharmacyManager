import React, { useCallback, useState } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Image,
    Modal,
    SafeAreaView,
    FlatList
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import StylesTheme from '../../global/theme/Styles.Theme';
import TextInputComponent from '../cTextInput/TextInput.component';
import { BackIcon, RightArowIcon } from '../../global/icon/Icon';
import { Colors } from '../../global/theme/Colors.Theme';

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

interface IState {
    search?: string;
    provinces?: {
        value?: any,
        data?: any,
    },
    districts?: {
        value?: any,
        data?: any,
    },
    wards?: {
        value?: any,
        data?: any,
    },
    isShowModal?: boolean,
}

const initialState: IState = {
    search: "",
    provinces: {
        value: null,
        data: null,
    },
    districts: {
        value: null,
        data: null,
    },
    wards: {
        value: null,
        data: null,
    },
    isShowModal: false,
};

const Address: React.FC<IProps> = (props: IProps) => {
    const [{ search, provinces, districts, wards, isShowModal }, setState] = useState<IState>({ ...initialState });
    const { value, placeholder, style, onComplete } = props;
    const isHaveValue = value && value !== "" ? true : false;

    const renderWhenHaveValue = (value: any) => {
        if (value) {
            return (
                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 12, paddingLeft: 10 }}>
                    <View style={{ width: 18, height: 18, borderRadius: 18, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center' }}>
                        <View style={{ width: 12, height: 12, borderRadius: 12, backgroundColor: '#ebebeb' }} />
                    </View>
                    <TouchableOpacity style={{ flex: 1, padding: 12, marginLeft: 12, }}>
                        <Text style={{ fontSize: 16, fontWeight: '400' }}>{value}</Text>
                    </TouchableOpacity>
                </View>
            );
        }
    };

    const renderWhenNotHaveValue = (value: any) => {
        if (value) {
            return (
                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 12, paddingLeft: 6, borderWidth: 1, borderColor: "#ccc", backgroundColor: '#fff', }}>
                    <View style={{ width: 22, height: 22, borderRadius: 22, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center', borderColor: Colors.primaryColor, borderWidth: 1, }}>
                        <View style={{ width: 12, height: 12, borderRadius: 12, backgroundColor: Colors.primaryColor }} />
                    </View>
                    <TouchableOpacity style={{ flex: 1, padding: 12, marginLeft: 12, }}>
                        <Text style={{ fontSize: 16, fontWeight: '400', color: Colors.primaryColor }}>{value}</Text>
                    </TouchableOpacity>
                </View>
            );
        }
    }

    return (
        <View style={{ flex: 1 }}>
            <TouchableOpacity style={[styles.componentDisplay, { ...style }]}
                onPress={() => {
                    setState({
                        isShowModal: true,
                    })
                }}
            >
                <Text style={[{ fontSize: 14, color: "#000" }, !isHaveValue && { color: "#ccc" }]}>{isHaveValue ? value : placeholder}</Text>
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
                            <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingRight: 24, height: 70 }}>
                                    <TouchableOpacity
                                        style={{ marginRight: 12 }}
                                        onPress={() => {
                                            setState({
                                                isShowModal: false,
                                            })
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
                                    <View style={{ paddingVertical: 12, paddingHorizontal: 12, backgroundColor: '#ebebeb', }}>
                                        <Text style={{ fontSize: 14, fontWeight: '600' }}>Chọn tỉnh/thành phố</Text>
                                    </View>
                                    <View style={{ backgroundColor: '#fff', paddingHorizontal: 12 }}>
                                        <View style={{ position: 'absolute', top: 40, bottom: 0, left: 30, backgroundColor: '#ccc', width: 1, }} />
                                        {
                                            renderWhenHaveValue("Phú Yên")
                                        }
                                        {/* {
                                            renderWhenHaveValue("Phú Yên")
                                        } */}
                                        {
                                            renderWhenNotHaveValue("Chọn Quận/Huyện")
                                        }
                                    </View>
                                    <View style={{ flex: 1, backgroundColor: '#fff', marginTop: 12, paddingLeft: 12, }}>
                                        <FlatList
                                            data={DATA}
                                            renderItem={({ item }) => {
                                                return (
                                                    <View style={{ flex: 1 }}>
                                                        <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                                                            <View style={{marginRight: 12}}>
                                                                <Text>A</Text>
                                                            </View>
                                                            <TouchableOpacity style={{ flex: 1, borderBottomColor: '#ccc', borderBottomWidth: 1, paddingVertical: 12, }}>
                                                                <Text>{item.title}</Text>
                                                            </TouchableOpacity>
                                                        </View>
                                                    </View>
                                                )
                                            }}
                                            keyExtractor={item => item.id}
                                        />
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
})

export default Address;