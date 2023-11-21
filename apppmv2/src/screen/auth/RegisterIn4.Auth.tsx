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
import { LoadingService } from '../../components/cLoading/Loading.component';
import { AlertService } from '../../components/cAlert/Alert.component';
import { ENUM } from '../../global/enum';
import ImagePicker from '../../components/cImagePicker/ImagePicker.component';

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

interface BaseState {
    label: string,
    value: any,
    isObligatory?: boolean,
    isRefresh?: boolean
}

// isObligatory 
type State = {
    account: Account,
    firstName: BaseState,
    lastName: BaseState,
    avatar: BaseState,
    phone: BaseState,
    email: BaseState,
    birthday: BaseState,
    addressDetail: BaseState,
    isVisibleDate: boolean;
    address: {
        label: string,
        value: any[],
        isObligatory?: boolean,
        isRefresh?: boolean
    }
    gender: {
        label: string,
        value: any,
        isObligatory?: boolean,
        isRefresh?: boolean,
        male: {
            isMale: boolean,
            maleView: any
        },
        female: {
            isFemale: boolean,
            femaleView: any
        },
        other: {
            isOther: boolean,
            otherView: any
        },
    },
    isError?: boolean;
}

const initialState: State = {
    account: {
        username: null,
        password: null,
        confirmPassword: null
    },
    firstName: {
        label: 'Họ và tên đệm',
        value: null,
        isObligatory: true,
        isRefresh: false
    },
    lastName: {
        label: 'Tên',
        value: null,
        isObligatory: true,
        isRefresh: false
    },
    avatar: {
        label: 'Ảnh đại diện',
        value: null,
        isObligatory: true,
        isRefresh: false
    },
    phone: {
        label: 'Số điện thoại',
        value: null,
        isObligatory: true,
        isRefresh: false
    },
    email: {
        label: 'Email',
        value: null,
        isObligatory: true,
        isRefresh: false
    },
    gender: {
        label: 'Giới tính',
        value: null,
        isObligatory: true,
        isRefresh: false,
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
    birthday: {
        label: 'Ngày tháng năm sinh',
        value: null,
        isObligatory: true,
        isRefresh: false
    },
    address: {
        label: 'Địa chỉ',
        value: [],
        isObligatory: true,
        isRefresh: false
    },
    addressDetail: {
        label: 'Địa chỉ cụ thể',
        value: null,
        isObligatory: true,
        isRefresh: false
    },
    isError: false,
    isVisibleDate: false,
};

export const RegisterInformationPersonal: React.FC<{ route: any }> = ({ route }) => {
    const navigation = useNavigation<StackNavigationProp<MainStackParams>>();
    const [{ account, firstName, lastName, avatar, phone, email, gender, birthday, addressDetail, isError, isVisibleDate, address }, setState] = useState<State>({ ...initialState });
    const { username, password } = route.params;

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
                birthday: {
                    ...prevState.birthday,
                    value: date,
                    isRefresh: !prevState.birthday.isRefresh
                },
                isVisibleDate: false
            }));
        }
    };

    const handleRegister = () => {
        if ((firstName.isObligatory && (!firstName.value || firstName.value === ''))
            || (lastName.isObligatory && (!lastName.value || lastName.value === ''))
            || (birthday.isObligatory && !birthday.value)
            || (gender.isObligatory && !gender.value)
            || (addressDetail.isObligatory && (!addressDetail.value || addressDetail.value === ''))
            || (address.isObligatory && address.value.length < 3)
        ) {

            setState((prevState: State) => ({
                ...prevState,
                isError: true,
            }));
            AlertService.show(ENUM.E_ERROR, '', 5000, 'Vui lòng nhập đầy đủ thông tin!');
            return;
        }

        let params = {
            username,
            password,
            firstName: firstName.value,
            lastName: lastName.value,
            avatar: avatar.value,
            phone: phone.value,
            email: email.value,
            gender: gender.value,
            birthday: moment(birthday.value).format("DD/MM/YYYY"),
            address: addressDetail.value + ", " + address.value,
        };

        console.log(params, 'params');

    }

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
                    value: 'Nam'
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
                    value: 'Nữ'
                }
            };
        } else {
            nextState = {
                gender: {
                    ...initialState.gender,
                    other: {
                        isOther: true,
                        otherView: null
                    },
                    value: 'Khác'
                }
            };
        }

        setState((prevState: State) => ({
            ...prevState,
            ...nextState
        }));
    };

    const isErrorObj = {
        firstName: isError && firstName.isObligatory && (!firstName.value || firstName.value === '') ? true : false,
        lastName: isError && lastName.isObligatory && (!lastName.value || lastName.value === '') ? true : false,
        birthday: isError && birthday.isObligatory && !birthday.value ? true : false,
        gender: isError && gender.isObligatory && !gender.value ? true : false,
        address: isError && address.isObligatory && address.value.length < 3 ? true : false,
        addressDetail: isError && addressDetail.isObligatory && (!addressDetail.value || addressDetail.value === '') ? true : false,
    }

    return (
        <View style={styles.container}>
            <HeaderComponent
                titleHeader={'Đăng ký thông tin cá nhân'}
                screenName='Register'
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

                        {/* Avatar */}
                        <View style={[styles.wrapXXX, { marginBottom: 0 }]}>
                            <ImagePicker label={avatar.label} onComplete={(value: string) => {
                                if (value.length > 0) {
                                    setState((prevState: State) => ({
                                        ...prevState,
                                        avatar: {
                                            ...prevState.avatar,
                                            value: value,
                                            isRefresh: !prevState.avatar?.isRefresh
                                        }
                                    }));
                                }
                            }} />
                        </View>

                        {/* First Name */}
                        <View style={styles.wrapXXX}>
                            <View style={[StylesTheme.onlyFlexDirectionAli_Center, { marginVertical: 2 }]}>
                                <Text numberOfLines={2} style={[styles.textSubTitle]}>
                                    {
                                        firstName.value && firstName.value !== "" ? firstName.label : " "
                                    }
                                </Text>
                                {
                                    firstName.value && firstName.value !== "" && (
                                        <Text style={styles.asteriskValid}>*</Text>
                                    )
                                }
                            </View>
                            <TextInputComponent
                                style={[styles.textInput, {}]}
                                placeholder={firstName.label}
                                value={firstName.value}
                                isObligatory={firstName.isObligatory}
                                isClose={true}
                                isShowIconError={isErrorObj.firstName}
                                isError={isErrorObj.firstName}
                                onComplete={(text) => {
                                    setState((prevState: State) => ({
                                        ...prevState,
                                        firstName: {
                                            ...prevState.firstName,
                                            value: text,
                                            isRefresh: !prevState.firstName?.isRefresh
                                        }
                                    }));
                                }}
                            />
                        </View>

                        {/* Last Name */}
                        <View style={styles.wrapXXX}>
                            <View style={[StylesTheme.onlyFlexDirectionAli_Center, { marginVertical: 2 }]}>
                                <Text numberOfLines={2} style={[styles.textSubTitle]}>
                                    {
                                        lastName.value && lastName.value !== "" ? lastName.label : " "
                                    }
                                </Text>
                                {
                                    lastName.value && lastName.value !== "" && (
                                        <Text style={styles.asteriskValid}>*</Text>
                                    )
                                }
                            </View>
                            <TextInputComponent
                                style={[styles.textInput, {}]}
                                placeholder="Tên"
                                value={lastName.value}
                                isObligatory={lastName.isObligatory}
                                isShowIconError={isErrorObj.lastName}
                                isError={isErrorObj.lastName}
                                onComplete={(text) => {
                                    setState((prevState: State) => ({
                                        ...prevState,
                                        lastName: {
                                            ...prevState.lastName,
                                            value: text,
                                            isRefresh: !prevState.lastName.isRefresh
                                        }
                                    }));
                                }}
                            />
                        </View>

                        {/* Birthday */}
                        <View style={styles.wrapXXX}>
                            <View style={[StylesTheme.onlyFlexDirectionAli_Center, { marginVertical: 2 }]}>
                                <Text numberOfLines={2} style={[styles.textSubTitle]}>
                                    {
                                        birthday.value ? birthday.label : " "
                                    }
                                </Text>
                                {
                                    birthday.value && birthday.value !== "" && birthday.isObligatory && (
                                        <Text style={styles.asteriskValid}>*</Text>
                                    )
                                }
                            </View>
                            <TouchableOpacity style={[styles.textInput, isErrorObj.birthday && { borderColor: 'red' }]} onPress={() => {
                                setState((prevState: State) => ({
                                    ...prevState,
                                    isVisibleDate: true
                                }));
                            }}>
                                <View style={StylesTheme.onlyFlexRow_AliCenter_JusSP}>
                                    <Text style={[styles.text, { marginVertical: 0 }, birthday.value === null ? { color: "#ccc" } : { color: "#000" }]}>
                                        {birthday.value ? moment(birthday.value).format('DD/MM/YYYY') : 'Chọn ngày tháng năm sinh'}
                                    </Text>
                                    {
                                        birthday.isObligatory && !birthday.value && (
                                            <View style={{ paddingRight: 8 }}>
                                                <Text style={styles.asteriskValid}>*</Text>
                                            </View>
                                        )
                                    }
                                </View>
                            </TouchableOpacity>
                            {/* modal chọn ngày */}
                            <View style={{ flex: 1, zIndex: 1, }}>
                                <DateTimePickerModal
                                    date={birthday.value === null ? new Date() : birthday.value}
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
                                <Text style={[styles.textSubTitle]}>{gender.label}</Text>
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
                                        email.value && email.value !== "" ? email.label : " "
                                    }
                                </Text>
                                {
                                    email.value && email.value !== "" && email.isObligatory && (
                                        <Text style={styles.asteriskValid}>*</Text>
                                    )
                                }
                            </View>
                            <TextInputComponent
                                style={[styles.textInput, {}]}
                                placeholder="Nhập email của bạn"
                                value={email.value}
                                isObligatory={true}
                                onComplete={(text) => {
                                    setState((prevState: State) => ({
                                        ...prevState,
                                        email: {
                                            ...prevState.email,
                                            value: text,
                                            isRefresh: !prevState.email.isRefresh
                                        }
                                    }));
                                }}
                            />
                        </View>

                        {/* địa chỉ */}

                        <View style={styles.wrapXXX}>
                            <Text style={styles.text}>{address.label}
                                {
                                    address.isObligatory && (
                                        <Text style={styles.asteriskValid}>  *</Text>
                                    )
                                }
                            </Text>
                            <Address
                                value={Array.isArray(address.value) ? address.value : []}
                                style={styles.componentDisplay}
                                placeholder="Vui lòng chọn địa chỉ!"
                                isObligatory={address.isObligatory}
                                isShowIconError={isErrorObj.address}
                                isError={isErrorObj.address}
                                onComplete={(value) => {
                                    console.log(value, 'value');
                                    if (Array.isArray(value)) {
                                        setState((prevState: State) => ({
                                            ...prevState,
                                            address: {
                                                ...prevState.address,
                                                value: value,
                                                isRefresh: !prevState.address.isRefresh
                                            }
                                        }));
                                    }
                                }}
                            />
                        </View>

                        <View style={styles.wrapXXX}>
                            <View style={[StylesTheme.onlyFlexDirectionAli_Center, { marginVertical: 2 }]}>
                                <Text numberOfLines={2} style={[styles.textSubTitle]}>
                                    {
                                        addressDetail.value && addressDetail.value !== "" ? addressDetail.label : " "
                                    }
                                </Text>
                                {
                                    addressDetail.value && addressDetail.value !== "" && (
                                        <Text style={styles.asteriskValid}>*</Text>
                                    )
                                }
                            </View>
                            <TextInputComponent
                                style={[styles.textInput, {}]}
                                placeholder="Nhập địa chỉ của bạn"
                                value={addressDetail.value}
                                isObligatory={addressDetail.isObligatory}
                                isShowIconError={isErrorObj.addressDetail}
                                isError={isErrorObj.addressDetail}
                                onComplete={(text) => {
                                    setState((prevState: State) => ({
                                        ...prevState,
                                        addressDetail: {
                                            ...prevState.addressDetail,
                                            value: text,
                                            isRefresh: !prevState.addressDetail.isRefresh
                                        }
                                    }));
                                }}
                            />
                        </View>
                    </View>
                    <View style={{ flex: 1, marginVertical: 22 }}>
                        {/* Button Continue */}
                        <TouchableOpacity
                            style={StylesTheme.btnPrimary}
                            onPress={handleRegister}
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
