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
        // this.setState({
        //     isVisibleDate: false
        // })
    };

    const handleConfirm = (date: any) => {
        // if(date !== undefined && date !== null) {
        //     this.setState({
        //         valueDate: moment(date).format("DD/MM/YYYY").toString(),
        //     })
        // }
        // this.hideDatePicker();
    };

    // handleRegister = () => {
    //     const { valueName, gender, male, female, genderOther, valueEmail, valueAddress, valueDate, isVisibleDate } = this.state;

    //     // this.props.navigation.navigate('BottomTabNavigator')
    // }
console.log('re-render');

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
                        <View style={styles.wrapXXX}>
                            <View style={{flex: 1, flexDirection: 'row', alignItems: 'center',
                            justifyContent: 'space-between'}}>
                                <View style={{flex: 0.48}}>
                                    <View style={StylesTheme.onlyFlexDirectionAli_Center}>
                                        <Text style={styles.text}>Họ và tên đệm</Text>
                                        <Text style={[styles.text, { color: 'red', marginLeft: 6 }]}>*</Text>
                                    </View>
                                    <TextInputComponent
                                        style={[styles.textInput, {}]}
                                        placeholder="Họ và tên đệm"
                                        value={firstName}
                                        onComplete={(text) => {
                                            console.log(text, 'text');
                                            
                                            setState((prevState: State) => ({
                                                ...prevState,
                                                firstName: text
                                            }));
                                        }}
                                    />
                                </View>

                                <View style={{flex: 0.48}}>
                                    <View style={StylesTheme.onlyFlexDirectionAli_Center}>
                                        <Text style={styles.text}>Tên</Text>
                                        <Text style={[styles.text, { color: 'red', marginLeft: 6 }]}>*</Text>
                                    </View>
                                    <TextInputComponent
                                        style={[styles.textInput, {}]}
                                        placeholder="Tên"
                                        value={lastName}
                                        onComplete={(text) => {
                                            setState((prevState: State) => ({
                                                ...prevState,
                                                lastName: text
                                            }));
                                        }}
                                    />
                                </View>

                            </View>
                        </View>

                        <View style={styles.wrapXXX}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={styles.text}>Ngày tháng năm sinh</Text>
                                <Text style={[styles.text, { color: 'red', marginLeft: 6 }]}>*</Text>
                            </View>

                            <TouchableOpacity style={[styles.textInput, {}]} onPress={() => {
                                setState((prevState: State) => ({
                                    ...prevState,
                                    isVisibleDate: true
                                }));
                                //showDatePicker()
                            }}>
                                <Text style={[{ fontSize: 18, fontWeight: '500' }, birthday === null ? { color: "#ccc" } : { color: "#000" }]}>{birthday === null ? 'Chọn ngày tháng năm sinh' : birthday}</Text>
                            </TouchableOpacity>
                            {/* modal chọn ngày */}
                            <View style={{ flex: 1, backgroundColor: "red", zIndex: 1, }}>
                                <DateTimePickerModal
                                    date={birthday === null ? new Date() : new Date(birthday)}
                                    // format="dd/MM/yyyy"
                                    isVisible={isVisibleDate}
                                    mode={'date'}
                                    onConfirm={handleConfirm}
                                    onCancel={() => {
                                        setState((prevState: State) => ({
                                            ...prevState,
                                            isVisibleDate: false
                                        }));
                                    }}
                                    is24Hour={true}
                                />
                            </View>
                        </View>
                        <View style={styles.wrapXXX}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={styles.text}>Giới tính</Text>
                                <Text style={[styles.text, { color: 'red', marginLeft: 6 }]}>*</Text>
                            </View>
                            <View style={styles.wrapCheckBoxGender}>
                                <Pressable
                                    style={{ flexDirection: 'row', alignItems: 'center' }}
                                    onPress={() => {
                                        // eventGender(0)
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
                                    style={{ flexDirection: 'row', alignItems: 'center' }}
                                    onPress={() => {
                                        // eventGender(1)
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
                                    style={{ flexDirection: 'row', alignItems: 'center' }}
                                    onPress={() => {
                                        // eventGender(2)
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
                        <View style={styles.wrapXXX}>
                            <Text style={styles.text}>Email</Text>
                            <TextInputComponent
                                style={[styles.textInput, {}]}
                                placeholder="Nhập email của bạn"
                                value={email}
                                onComplete={(text) => {
                                    // this.setState({
                                    //     valueEmail: text,
                                    // });
                                }}
                            />
                        </View>

                        {/* địa chỉ */}
                        <View style={styles.wrapXXX}>
                            <Text style={styles.text}>Địa chỉ</Text>
                            <TextInputComponent
                                style={[styles.textInput, {}]}
                                placeholder="Nhập địa chỉ của bạn"
                                value={address}
                                onComplete={(text) => {

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
        padding: DEFAUlT_SIZE_PADDING,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 24,
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
        backgroundColor: '#4eac6d',
        borderWidth: 2,
        borderColor: 'red',
        borderRadius: 20,
        marginRight: 10,
    },

    genderNoActive: {
        width: 20,
        height: 20,
        backgroundColor: '#fff',
        borderWidth: 2,
        borderColor: '#4eac6d',
        borderRadius: 20,
        marginRight: 10,
    },

    text: {
        fontSize: 18,
        fontWeight: '400',
        marginVertical: 12,
    },

    wrapXXX: {
        marginVertical: 6,
    },
});

export default RegisterInformationPersonal;
