import { useNavigation, useRoute } from '@react-navigation/core';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useEffect } from 'react';
import {
    View,
    Image,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { GoogleSignin, statusCodes, GoogleSigninButton } from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';

import { MainStackParams } from '../../navigation/Stack.Navigator';
import StylesTheme from '../../global/theme/Styles.Theme';
import Function from '../../global/assets/service/Function.Service';
import { EyeHideIcon, EyeShowIcon } from '../../global/icon/Icon';
import TextInputComponent from '../../components/cTextInput/TextInput.component';
import { Colors } from '../../global/theme/Colors.Theme';
import { env } from '../../utils/env.utils';
import HttpService from '../../service/HttpService.Service';
import { LoadingService } from '../../components/cLoading/Loading.component';
import { AlertService } from '../../components/cAlert/Alert.component';
import { ENUM } from '../../global/enum';
import { User } from '../../type/User.Type';
import * as Progress from 'react-native-progress';

import { useAppDispatch } from '../../redux/reduxHook.redux';
import { setDataCount } from '../../redux/cart-slice.redux';

const Permission: React.FC<{ route: any }> = ({ route }) => {
    const navigation = useNavigation<StackNavigationProp<MainStackParams>>();
    const dispatch = useAppDispatch();

    useEffect(() => {
        // Initial configuration
        GoogleSignin.configure({
            // Mandatory method to call before calling signIn()
            // scopes: ['https://www.googleapis.com/auth/drive.readonly'],
            // Repleace with your webClientId
            // Generated from Firebase console
            webClientId: '493934264080-edtlckbg0dlfqomsa7j1291oql9bhgks.apps.googleusercontent.com',
        });

        // Check if user is already signed in
        handleCheckRememberLogin();
    }, [route]);

    const handleCheckRememberLogin = async () => {
        const storage: any = await Function.getAppData(ENUM.KEY_IN4USER);
        if (storage) {
            if (storage?.isLoginSocial) {
                _isSignedIn();
            } else {
                if (storage?.isRememberPassword && storage?.id) {
                    Function.setAppData(ENUM.KEY_IN4USER, { ...storage, isRememberPassword: true, isLoginSocial: false });
                    console.log(storage, 'storage');

                    getNumberCount(storage);
                } else {
                    if (route.params?.data && route.params?.isLogin) {
                        getNumberCount(route.params?.data);
                    } else {
                        navigation.navigate("Login");
                    }
                }
            }
        } else {
            navigation.navigate("Login");
        }
    }

    const _isSignedIn = async () => {
        const isSignedIn = await GoogleSignin.isSignedIn();
        if (isSignedIn) {
            let info = await GoogleSignin.signInSilently();
            const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
            return subscriber; // unsubscribe on unmount
        } else {
            navigation.navigate("Login");
        }
    };

    const onAuthStateChanged = (user: any) => {
        const dataUser = {
            "username": user?._user?.email ? user?._user?.email : '',
            "firstName": "",
            "lastName": "",
            "fullName": user?._user?.displayName ? user?._user?.displayName : '',
            "avatar": user?._user?.photoURL ? user?._user?.photoURL : '',
            "phone": user?._user?.phoneNumber ? user?._user?.phoneNumber : '',
            "email": user?._user?.email ? user?._user?.email : '',
            "gender": '',
            "birthday": '',
            "address": '',
            "id": Array.isArray(user?._user?.providerData) ? user?._user?.providerData[0]?.uid : user?._user?.uid ? user?._user?.uid : '',
        };
        Function.setAppData(ENUM.KEY_IN4USER, { ...dataUser, isRememberPassword: true, isLoginSocial: true });
        getNumberCount(dataUser);
    }

    const getNumberCount = (dataUser: any) => {
        try {
            const { id } = dataUser;
            if (id) {
                HttpService.Get(`${env.URL}/user/countNumberCartAndBill/${id}`).then((res: any) => {
                    console.log(res, 'res');
                    if (res?.status === 200 && res?.statusText === ENUM.E_SUCCESS) {
                        // save to redux state
                        dispatch(setDataCount(res?.data ? res?.data : {}));
                        navigation.navigate("BottomTabNavigator", {
                            data: dataUser
                        });
                    }
                })
            } else {
                navigation.navigate("Login");
                AlertService.show(ENUM.E_ERROR, 'Phiên bản đã hết hạn\nVui lòng đăng nhập lại!', 5000, 'ERROR');
            }
        } catch (error) {

        }
    }

    return (
        <View style={{ flex: 1, backgroundColor: Colors.clWhite, justifyContent: 'center', alignItems: 'center' }}>
            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                <Image source={require('../../global/assets/image/logo.png')} style={StylesTheme.sizeLogo} />
                <Progress.Bar
                    progress={0.5}
                    width={200}
                    indeterminate={true}
                    borderWidth={0}
                    height={2}
                    borderRadius={5}
                    // animationType={'decay'}
                    color={Colors.primaryColor}
                />
            </View>
        </View>
    );
}
export default Permission;