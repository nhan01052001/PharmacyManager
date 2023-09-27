import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    TextInput,
    FlatList,
    ScrollView,
    Pressable,
    Dimensions,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import moment from 'moment';

import { Account } from '../../type/User.Type';
import { User } from '../../type/User.Type';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { MainStackParams } from '../../navigation/Stack.Navigator';

import TextInputComponent from '../../components/cTextInput/TextInput.component';
import { HeaderComponent } from '../../components/cHeadder/Header.Component';
import StylesTheme from '../../global/theme/Styles.Theme';
import { Colors } from '../../global/theme/Colors.Theme';
import Address from '../../components/cAddress/Address.component';

const { width, height } = Dimensions.get('window');

const DEFAUlT_SIZE_PADDING = width > 410 ? 12 : 10;

type ErrorAccount = {
    errorUsername: {
        isErrorUsername: boolean,
        messErrorUsername: string
    },
    errorPassword: {
        isErrorPassword: boolean,
        messErrorPassword: string
    },
    errorConfirmPassword: {
        isErrorConfirmPassword: boolean,
        messErrorConfirmPassword: string,
    }
}

type State = User & {
    account: Account,
    isVisibleDate: boolean;
}

const initialState: State = {
    account: {
        username: null,
        password: null,
        confirmPassword: null
    },
    firstName: null,
    lastName: null,
    avatar: null,
    phone: null,
    email: null,
    gender: {
        male: {
            isMale: false,
            maleView: null
        },
        female: {
            isFemale: false,
            femaleView: null
        },
        other: {
            isOther: false,
            otherView: null
        }
    },
    birthday: null,
    address: null,
    isVisibleDate: false,
};

export const RegisterInformationPersonal: React.FC<{ route: any }> = ({ route }) => {
    const navigation = useNavigation<StackNavigationProp<MainStackParams>>();
    const [{ account, firstName, lastName, avatar, phone, email, gender, birthday, address, isVisibleDate }, setState] = useState<State>({ ...initialState });

    const hideDatePicker = () => {
        setState((prevState: State) => ({
            ...prevState,
            isVisibleDate: false
        }));
    };

    const handleConfirm = (date: any) => {
        if (date) {
            setState((prevState: State) => ({
                ...prevState,
                birthday: date,
                isVisibleDate: false
            }));
        }
    };

    // handleRegister = () => {
    //     const { valueName, gender, male, female, genderOther, valueEmail, valueAddress, valueDate, isVisibleDate } = this.state;

    //     // this.props.navigation.navigate('BottomTabNavigator')
    // }

    const eventGender = (value: number) => {

        let nextState = {};

        if (value === 0) {
            nextState = {
                gender: {
                    ...initialState.gender,
                    male: {
                        isMale: true,
                        maleView: null
                    },
                }
            };
        } else if (value === 1) {
            nextState = {
                gender: {
                    ...initialState.gender,
                    female: {
                        isFemale: true,
                        femaleView: null
                    },
                }
            };
        } else {
            nextState = {
                gender: {
                    ...initialState.gender,
                    other: {
                        isOther: true,
                        otherView: null
                    }
                }
            };
        }

        setState((prevState: State) => ({
            ...prevState,
            ...nextState
        }));
    };


    return (
        <View style={styles.container}>
            <HeaderComponent
                titleHeader={'Đăng ký thông tin cá nhân'}
                isOptionHome={false}
                goBack={() => navigation.goBack()}
            />
            <KeyboardAwareScrollView style={{ flex: 1 }}>
                <View style={{ flex: 1, paddingHorizontal: 24 }}>
                    {/* logo and slogan */}
                    <View style={StylesTheme.flexCenter}>
                        <Image source={require('../../global/assets/image/logo.png')} style={{ width: 200, height: 132 }} />
                    </View>

                    {/*  */}
                    <View style={{ flex: 1 }}>
                        {/* First Name */}
                        <View style={styles.wrapXXX}>
                            <View style={[StylesTheme.onlyFlexDirectionAli_Center, { marginVertical: 2 }]}>
                                <Text numberOfLines={2} style={[styles.textSubTitle]}>
                                    {
                                        firstName && firstName !== "" ? "Họ và tên đệm" : " "
                                    }
                                </Text>
                                {
                                    firstName && firstName !== "" && (
                                        <Text style={styles.asteriskValid}>*</Text>
                                    )
                                }
                            </View>
                            <TextInputComponent
                                style={[styles.textInput, {}]}
                                placeholder="Họ và tên đệm"
                                value={firstName}
                                isObligatory={true}
                                isClose={true}
                                onComplete={(text) => {
                                    setState((prevState: State) => ({
                                        ...prevState,
                                        firstName: text
                                    }));
                                }}
                            />
                        </View>

                        {/* Last Name */}
                        <View style={styles.wrapXXX}>
                            <View style={[StylesTheme.onlyFlexDirectionAli_Center, { marginVertical: 2 }]}>
                                <Text numberOfLines={2} style={[styles.textSubTitle]}>
                                    {
                                        lastName && lastName !== "" ? "Tên" : " "
                                    }
                                </Text>
                                {
                                    lastName && lastName !== "" && (
                                        <Text style={styles.asteriskValid}>*</Text>
                                    )
                                }
                            </View>
                            <TextInputComponent
                                style={[styles.textInput, {}]}
                                placeholder="Tên"
                                value={lastName}
                                isObligatory={true}
                                onComplete={(text) => {
                                    setState((prevState: State) => ({
                                        ...prevState,
                                        lastName: text
                                    }));
                                }}
                            />
                        </View>

                        {/* Birthday */}
                        <View style={styles.wrapXXX}>
                            <View style={[StylesTheme.onlyFlexDirectionAli_Center, { marginVertical: 2 }]}>
                                <Text numberOfLines={2} style={[styles.textSubTitle]}>
                                    {
                                        birthday ? "Ngày tháng năm sinh" : " "
                                    }
                                </Text>
                                {
                                    birthday && birthday !== "" && (
                                        <Text style={styles.asteriskValid}>*</Text>
                                    )
                                }
                            </View>
                            <TouchableOpacity style={[styles.textInput, {}]} onPress={() => {
                                setState((prevState: State) => ({
                                    ...prevState,
                                    isVisibleDate: true
                                }));
                            }}>
                                <Text style={[styles.text, { marginVertical: 0 }, birthday === null ? { color: "#ccc" } : { color: "#000" }]}>
                                    {birthday ? moment(birthday).format('DD/MM/YYYY') : 'Chọn ngày tháng năm sinh'}
                                </Text>
                            </TouchableOpacity>
                            {/* modal chọn ngày */}
                            <View style={{ flex: 1, zIndex: 1, }}>
                                <DateTimePickerModal
                                    date={birthday === null ? new Date() : birthday}
                                    // format="dd/MM/yyyy"
                                    isVisible={isVisibleDate}
                                    mode={'date'}
                                    onConfirm={handleConfirm}
                                    onCancel={() => {
                                        hideDatePicker();
                                    }}
                                    cancelTextIOS={"Huỷ"}
                                    confirmTextIOS={"Xác nhận"}
                                    is24Hour={true}
                                />
                            </View>
                        </View>

                        {/* Gender */}
                        <View style={styles.wrapXXX}>
                            <View style={StylesTheme.onlyFlexDirectionAli_Center}>
                                <Text style={[styles.textSubTitle]}>Giới tính</Text>
                                <Text style={[styles.text, styles.asteriskValid]}>*</Text>
                            </View>
                            <View style={styles.wrapCheckBoxGender}>
                                <Pressable
                                    style={StylesTheme.onlyFlexDirectionAli_Center}
                                    onPress={() => {
                                        eventGender(0);
                                    }}
                                >
                                    {gender?.male.isMale === true ? (
                                        <View style={styles.genderActive}></View>
                                    ) : (
                                        <View style={styles.genderNoActive}></View>
                                    )}

                                    <Text>Nam</Text>
                                </Pressable>
                                <Pressable
                                    style={StylesTheme.onlyFlexDirectionAli_Center}
                                    onPress={() => {
                                        eventGender(1);
                                    }}
                                >
                                    {gender?.female.isFemale === true ? (
                                        <View style={styles.genderActive}></View>
                                    ) : (
                                        <View style={styles.genderNoActive}></View>
                                    )}
                                    <Text>Nữ</Text>
                                </Pressable>
                                <Pressable
                                    style={StylesTheme.onlyFlexDirectionAli_Center}
                                    onPress={() => {
                                        eventGender(2);
                                    }}
                                >
                                    {gender?.other.isOther === true ? (
                                        <View style={styles.genderActive}></View>
                                    ) : (
                                        <View style={styles.genderNoActive}></View>
                                    )}
                                    <Text>Khác</Text>
                                </Pressable>
                            </View>
                        </View>

                        {/* Email */}
                        <View style={styles.wrapXXX}>
                            <View style={[StylesTheme.onlyFlexDirectionAli_Center, { marginVertical: 2 }]}>
                                <Text numberOfLines={2} style={[styles.textSubTitle]}>
                                    {
                                        email && email !== "" ? "Email" : " "
                                    }
                                </Text>
                                {
                                    email && email !== "" && (
                                        <Text style={styles.asteriskValid}>*</Text>
                                    )
                                }
                            </View>
                            <TextInputComponent
                                style={[styles.textInput, {}]}
                                placeholder="Nhập email của bạn"
                                value={email}
                                isObligatory={true}
                                onComplete={(text) => {
                                    setState((prevState: State) => ({
                                        ...prevState,
                                        email: text
                                    }));
                                }}
                            />
                        </View>

                        {/* địa chỉ */}

                        <View style={styles.wrapXXX}>
                            <Text style={styles.text}>Địa chỉ</Text>
                            <Address
                                value={""}
                                style={styles.componentDisplay}
                                placeholder="Vui lòng chọn địa chỉ!"
                                onComplete={(value) => {
                                    console.log(value, 'value');
                                }}
                            />
                        </View>

                        <View style={styles.wrapXXX}>
                            <View style={[StylesTheme.onlyFlexDirectionAli_Center, { marginVertical: 2 }]}>
                                <Text numberOfLines={2} style={[styles.textSubTitle]}>
                                    {
                                        address && address !== "" ? "Địa chỉ cụ thể" : " "
                                    }
                                </Text>
                                {
                                    address && address !== "" && (
                                        <Text style={styles.asteriskValid}>*</Text>
                                    )
                                }
                            </View>
                            <TextInputComponent
                                style={[styles.textInput, {}]}
                                placeholder="Nhập địa chỉ của bạn"
                                value={address}
                                isObligatory={true}
                                onComplete={(text) => {
                                    setState((prevState: State) => ({
                                        ...prevState,
                                        address: text
                                    }));
                                }}
                            />
                        </View>
                    </View>
                    <View style={{ flex: 1, marginVertical: 22 }}>
                        {/* Button Continue */}
                        <TouchableOpacity
                            style={StylesTheme.btnPrimary}
                            onPress={() => {
                                // handleRegister()
                            }}
                        >
                            <Text style={StylesTheme.styleTextBtnBasic}>
                                Tiếp theo
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </KeyboardAwareScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },

    textInput: {
        flex: 1,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderColor: '#ccc',
        fontSize: 18,
        fontWeight: '500',
    },

    wrapCheckBoxGender: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 12,
    },

    genderActive: {
        width: 20,
        height: 20,
        backgroundColor: Colors.primaryColor,
        borderWidth: 2,
        borderColor: '#ccc',
        borderRadius: 20,
        marginRight: 10,
    },

    genderNoActive: {
        width: 20,
        height: 20,
        backgroundColor: '#fff',
        borderWidth: 2,
        borderColor: '#000',
        borderRadius: 20,
        marginRight: 10,
    },

    text: {
        fontSize: 18,
        fontWeight: '400',
        marginVertical: 12,
    },

    wrapXXX: {
        marginVertical: 12,
    },

    flex048: {
        flex: 0.48,
    },

    asteriskValid: {
        color: 'red',
        marginLeft: 6
    },

    textSubTitle: {
        color: Colors.colorGrey,
        fontWeight: '500',
    },

    componentDisplay: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottomWidth: 1,
        borderBottomColor: "#ccc",
        paddingVertical: 12,
    },
});

export default RegisterInformationPersonal;
