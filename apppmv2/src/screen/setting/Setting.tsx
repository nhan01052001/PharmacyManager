import { useNavigation } from '@react-navigation/core';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useEffect, useState } from 'react';
import {
    StyleSheet,
    Text,
    View,
    SafeAreaView,
    TouchableOpacity,
    Platform,
    StatusBar,
    Image
} from 'react-native';
import { GoogleSignin, statusCodes, GoogleSigninButton } from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';
import { MainStackParams } from '../../navigation/Stack.Navigator';
import StylesTheme from '../../global/theme/Styles.Theme';
import { Colors } from '../../global/theme/Colors.Theme';
import ImagePicker from '../../components/cImagePicker/ImagePicker.component';
import { RightArowIcon, HistoryIcon, ProfileIcon, InformationSecurityIcon, CustomerCareIcon, ContactIcon } from '../../global/icon/Icon';
import Function from '../../global/assets/service/Function.Service';
import { ENUM } from '../../global/enum';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface IState {
    info?: any
}

const initialState: IState = {
    info: null,
};

const Setting: React.FC = () => {
    const navigation = useNavigation<StackNavigationProp<MainStackParams>>();
    const [{ info }, setState] = useState<IState>({ ...initialState });

    const _signOut = async () => {
        // Remove user session from the device.
        try {
            await GoogleSignin.revokeAccess();
            await GoogleSignin.signOut();
            auth()
                .signOut()
                .then(() => {
                    navigation.navigate('Login');
                });
        } catch (error) {
            console.error(error);
        }
    };

    const clearAsyncStorage = async() => {
        navigation.navigate('Login');
        AsyncStorage.clear();
    }

    const getData = async () => {
        try {
            const rs = await Function.getAppData(ENUM.KEY_IN4USER); console.log(rs, 'rs');

            if (rs) {
                setState((prevState: IState) => ({
                    ...prevState,
                    info: rs
                }));
            }
        } catch (error) {

        }
    }

    useEffect(() => {
        getData();
    }, []);

    return (
        <View style={{ flex: 1 }}>
            <StatusBar
                animated={true}
                backgroundColor="#fff"
                barStyle={'dark-content'}
            />
            <View style={[StylesTheme.droidSafeArea, { width: '100%', height: 120, backgroundColor: Colors.primaryColor, }, Platform.OS === 'android' && { paddingTop: 30 }]}>
                <View style={[StylesTheme.droidSafeArea, { flex: 1, alignItems: 'flex-start', justifyContent: 'flex-end', paddingHorizontal: 12 }]}>
                    <View style={{ flexDirection: 'row', flex: 1, justifyContent: 'flex-start' }}>
                        <View>
                            <ImagePicker label={""} value={{ uri: info?.avatar ? info?.avatar : "https://fnege-medias.fr/wp-content/uploads/2021/07/user.jpg" }} width={60} height={60} borderRadius={60} onComplete={(value: string) => {
                                // if (value.length > 0) {
                                //     setState((prevState: State) => ({
                                //         ...prevState,
                                //         avatar: {
                                //             ...prevState.avatar,
                                //             value: value,
                                //             isRefresh: !prevState.avatar?.isRefresh
                                //         }
                                //     }));
                                // }
                            }} />
                        </View>
                        <View style={{ marginLeft: 12 }}>
                            <Text style={[StylesTheme.textLabel, { fontSize: 16 }]}>{info?.fullName}</Text>
                            <View style={{ backgroundColor: '#edd413', borderRadius: 8, justifyContent: 'center', alignItems: 'center', paddingVertical: 3 }}>
                                <Text style={[StylesTheme.textLabel, { fontSize: 14 }]}>Thành viên vàng</Text>
                            </View>
                        </View>
                    </View>
                </View>
            </View>

            <View style={{ flex: 1, backgroundColor: Colors.clWhite }}>
                <TouchableOpacity style={[StylesTheme.onlyFlexRow_AliCenter_JusSP,
                { borderBottomColor: Colors.colorGrey, borderBottomWidth: 2, paddingHorizontal: 12, paddingVertical: 16 }]} onPress={() => {

                }}>
                    <View
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                        }}
                    >
                        <ProfileIcon size={30} color={'#000'} />
                        <Text style={[StylesTheme.textLabel, { fontSize: 16, marginLeft: 6, }]}>Chỉnh sửa thông tin cá nhân</Text>
                    </View>
                    <View
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                        }}
                    >
                        <RightArowIcon size={18} color={'#000'} />
                    </View>
                </TouchableOpacity>

                <TouchableOpacity style={[StylesTheme.onlyFlexRow_AliCenter_JusSP,
                { paddingHorizontal: 12, paddingVertical: 16 }]} onPress={() => {

                }}>
                    <View
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                        }}
                    >
                        <HistoryIcon size={30} color={'#000'} />
                        <Text style={[StylesTheme.textLabel, { fontSize: 16, marginLeft: 6 }]}>Lịch sử mua hàng</Text>
                    </View>
                    <View
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                        }}
                    >
                        <RightArowIcon size={18} color={'#000'} />
                    </View>
                </TouchableOpacity>

                <View style={{ width: '100%', height: 10, backgroundColor: Colors.colorGrey }} />

                <TouchableOpacity style={[StylesTheme.onlyFlexRow_AliCenter_JusSP,
                { borderBottomColor: Colors.colorGrey, borderBottomWidth: 2, paddingHorizontal: 12, paddingVertical: 16 }]} onPress={() => {

                }}>
                    <View
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                        }}
                    >
                        <InformationSecurityIcon size={30} color={'#000'} />
                        <Text style={[StylesTheme.textLabel, { fontSize: 16, marginLeft: 6 }]}>Bảo mật tài khoản</Text>
                    </View>
                    <View
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                        }}
                    >
                        <RightArowIcon size={18} color={'#000'} />
                    </View>
                </TouchableOpacity>

                <TouchableOpacity style={[StylesTheme.onlyFlexRow_AliCenter_JusSP,
                { borderBottomColor: Colors.colorGrey, borderBottomWidth: 2, paddingHorizontal: 12, paddingVertical: 16 }]} onPress={() => {

                }}>
                    <View
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                        }}
                    >
                        <CustomerCareIcon size={30} color={'#000'} />
                        <Text style={[StylesTheme.textLabel, { fontSize: 16, marginLeft: 6 }]}>Chăm sóc khách hàng</Text>
                    </View>
                    <View
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                        }}
                    >
                        <RightArowIcon size={18} color={'#000'} />
                    </View>
                </TouchableOpacity>

                <TouchableOpacity style={[
                    {
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderBottomColor: Colors.colorGrey,
                        borderBottomWidth: 2,
                        paddingHorizontal: 12,
                        paddingVertical: 16
                    }
                ]} onPress={() => {

                }}>
                    <ContactIcon size={40} color={'#000'} />
                    <View style={{ marginLeft: 8 }}>
                        <Text style={[StylesTheme.textLabel, { fontSize: 16, color: Colors.primaryColor, fontWeight: Platform.OS === 'ios' ? '700' : '800' }]}>0373523365</Text>
                        <Text style={[StylesTheme.text14, { textAlign: 'center' }]}>Tổng đài</Text>
                    </View>
                </TouchableOpacity>

                <View style={[{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    paddingHorizontal: 12,
                    paddingVertical: 16
                }]}>
                    <TouchableOpacity
                        onPress={() => {
                            if(info?.isLoginSocial) {
                                _signOut();
                            } else {
                                clearAsyncStorage();
                            }
                        }}
                    ><Text style={[StylesTheme.textLabel]}>Đăng xuất</Text></TouchableOpacity>
                </View>


            </View>
        </View >
    )
}

export default Setting;