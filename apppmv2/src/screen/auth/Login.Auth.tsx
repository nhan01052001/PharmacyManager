import { useNavigation } from '@react-navigation/core';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useCallback, useState, Reducer, useReducer, useEffect } from 'react';
import {
    SafeAreaView,
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    Pressable,
    Image,
    ActivityIndicator
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

interface IErrorUsernamePassword {
    errorUsername: {
        isErrorUsername: boolean,
        messErrorUsername: string
    },
    errorPassword: {
        isErrorPassword: boolean,
        messErrorPassword: string
    }
}

interface IState {
    username: any;
    password: any;
    isError: IErrorUsernamePassword;
    isRememberPassword: boolean;
    isPasswordVisibility: boolean;
}

interface IAction {
    type: string;
    value?: any;
}

const initialState: IState = {
    username: "",
    password: "",
    isError: {
        errorUsername: {
            isErrorUsername: false,
            messErrorUsername: ""
        },
        errorPassword: {
            isErrorPassword: false,
            messErrorPassword: ""
        }
    },
    isRememberPassword: false,
    isPasswordVisibility: false,
};

// const reducer = (state: IState, action: IAction) => { 
//     if (action.type === "reset") {
//         return initialState;
//     }

//     const result: IState = { ...state };
//     result[action.type] = action.value;
//     return result;
// };

export const Login: React.FC = () => {
    const navigation = useNavigation<StackNavigationProp<MainStackParams>>();
    const [{ username, password, isError, isRememberPassword, isPasswordVisibility }, setState] = useState<IState>({ ...initialState });
    // const [state, dispatch] = useReducer<Reducer<IState, IAction>, IState>(reducer, initialState, () => initialState);
    const [notification, setNotification] = useState<string>("");

    const handleOnChangeTextUsername = useCallback((text: any) => {
        debugger
        let nextState: any = {};
        if (text.length === 0) {
            nextState = {
                errorUsername: {
                    isErrorUsername: true,
                    messErrorUsername: "Tài khoản không được để trống!"
                }
                // isError: {
                //     ...isError,
                //     errorUsername: {
                //         isErrorUsername: true,
                //         messErrorUsername: "Tài khoản không được để trống!"
                //     }
                // },
            };
        } else {
            nextState = {
                // isError: {
                //     ...isError,
                //     errorUsername: {
                //         isErrorUsername: false,
                //         messErrorUsername: ""
                //     }
                // },
                errorUsername: {
                    isErrorUsername: false,
                    messErrorUsername: ""
                }
            };
        }
        setState((prevState: any) => ({
            ...prevState,
            username: text,
            // ...nextState
            isError: {
                ...prevState?.isError,
                ...nextState
            }
        }));
    }, [username]);

    const handleOnChangeTextPassword = useCallback((text: any) => {
        debugger
        let nextState: any = {};
        if (text.length === 0) {
            nextState = {
                errorPassword: {
                    isErrorPassword: true,
                    messErrorPassword: "Mật khẩu không được để trống!"
                }
                // isError: {
                //     ...isError,
                //     errorPassword: {
                //         isErrorPassword: true,
                //         messErrorPassword: "Mật khẩu không được để trống!"
                //     }
                // },
            };
        } else {
            nextState = {
                errorPassword: {
                    isErrorPassword: false,
                    messErrorPassword: ""
                }
                // isError: {
                //     ...isError,
                //     errorPassword: {
                //         isErrorPassword: false,
                //         messErrorPassword: ""
                //     }
                // },
            }
        }
        setState((prevState: any) => ({
            ...prevState,
            password: text,
            // ...nextState
            isError: {
                ...prevState?.isError,
                ...nextState
            }
        }))
    }, [password]);

    const handleLogin = () => {
        try {
            if (typeof username === 'string' && typeof password === 'string' && username.length > 0 && password.length > 0) {
                LoadingService.show();
                HttpService.Post(`${env.URL}/auth/login`, {
                    username,
                    password
                }).then((res: any) => {
                    LoadingService.hide();
                    if (res?.status === 200 && res?.statusText === ENUM.E_SUCCESS && res?.data) {
                        Function.setAppData(ENUM.KEY_IN4USER, res?.data);
                        navigation.navigate("BottomTabNavigator", {
                            data: res?.data
                        });
                    }
                }).catch((error) => {
                    const textError = error?.response?.data?.message;
                    AlertService.show(ENUM.E_ERROR, '', 5000, textError ? textError : 'Sai cú pháp')
                    LoadingService.hide();
                })
            } else {
                AlertService.show(ENUM.E_ERROR, '', 5000, 'Vui lòng nhập đầy đủ thông tin!')
                setState((prevState: any) => ({
                    ...prevState,
                    isError: {
                        errorUsername: {
                            isErrorUsername: true,
                            messErrorUsername: "Tài khoản không được để trống!"
                        },
                        errorPassword: {
                            isErrorPassword: true,
                            messErrorPassword: "Mật khẩu không được để trống!"
                        }
                    }
                }));
            }
        } catch (error) {
            AlertService.show(ENUM.E_ERROR, '', 5000, 'Sai cú pháp')
            LoadingService.hide();
        }
    }

    const signInWithGoogle = async () => {
        // It will prompt google Signin Widget
        try {
            await GoogleSignin.hasPlayServices({
                // Check if device has Google Play Services installed
                // Always resolves to true on iOS
                showPlayServicesUpdateDialog: true,
            });
            LoadingService.show();
            const userInfo = await GoogleSignin.signIn(); console.log(userInfo, 'userInfo');

            const credential = auth.GoogleAuthProvider.credential(userInfo.idToken);
            await auth().signInWithCredential(credential);
            console.log(credential, 'credential');
            
            _isSignedIn();
        } catch (error) {
            LoadingService.hide();
            console.log(JSON.stringify(error), 'Message');
        }
    }

    useEffect(() => {
        LoadingService.show();
        // Initial configuration
        GoogleSignin.configure({
            // Mandatory method to call before calling signIn()
            // scopes: ['https://www.googleapis.com/auth/drive.readonly'],
            // Repleace with your webClientId
            // Generated from Firebase console
            webClientId: '493934264080-edtlckbg0dlfqomsa7j1291oql9bhgks.apps.googleusercontent.com',
        });
        // Check if user is already signed in
        _isSignedIn();
    }, []);

    const _isSignedIn = async () => {
        const isSignedIn = await GoogleSignin.isSignedIn();
        if (isSignedIn) {
            console.log(isSignedIn, 'isSignedIn');
            
            LoadingService.hide();
            let info = await GoogleSignin.signInSilently();
            const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
            return subscriber; // unsubscribe on unmount
        } else {
            LoadingService.hide();
            console.log('Please Login');
        }
    };

    const onAuthStateChanged = (user: any) => {
        LoadingService.hide();
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
        console.log(dataUser, user, 'user');
        Function.setAppData(ENUM.KEY_IN4USER, dataUser);
        navigation.navigate("BottomTabNavigator", {
            data: dataUser
        });
    }

    const _signOut = async () => {
        // Remove user session from the device.
        try {
            await GoogleSignin.revokeAccess();
            await GoogleSignin.signOut();
            auth()
                .signOut()
                .then(() => console.warn('Your are signed out!'));
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <SafeAreaView style={[styles.container, StylesTheme.droidSafeArea]}>
            <KeyboardAwareScrollView style={StylesTheme.flexW100}>
                <View style={StylesTheme.paddingH24}>
                    {/* logo and slogan */}
                    <View
                        style={{
                            flex: 1,
                            alignItems: 'center',
                            justifyContent: 'flex-start',
                        }}
                    >
                        <Image source={require('../../global/assets/image/logo.png')} style={StylesTheme.sizeLogo} />
                        <Text style={styles.textSlogan}>My slogan</Text>
                    </View>

                    {/* TextInput username, password */}
                    <View style={styles.wrapTextInput}>
                        {/* username */}
                        <View style={StylesTheme.marginV12}>
                            <View style={[StylesTheme.onlyFlexRow_AliCenter_JusSP, { marginVertical: 2 }]}>
                                <Text numberOfLines={2} style={[styles.textSubTitle, isError?.errorUsername?.messErrorUsername !== "" && { color: "red" }]}>
                                    {isError?.errorUsername?.messErrorUsername !== "" ? isError?.errorUsername?.messErrorUsername :
                                        username && username !== "" ? "Số điện thoại" : ""}
                                </Text>
                            </View>
                            <TextInputComponent
                                style={[styles.textInput, {}]}
                                placeholder="Số điện thoại hoặc"
                                keyboardType={'numeric'}
                                value={username}
                                isError={isError?.errorUsername?.isErrorUsername}
                                onComplete={(text) => {
                                    handleOnChangeTextUsername(text);
                                }}
                                isClose={true}
                                isShowIconError={isError?.errorUsername?.isErrorUsername}
                            />
                        </View>

                        {/* password */}
                        <View>
                            <View style={[StylesTheme.onlyFlexRow_AliCenter_JusSP, { marginVertical: 2, marginTop: 12 }]}>
                                <Text numberOfLines={2} style={[styles.textSubTitle, isError?.errorPassword?.messErrorPassword !== "" && { color: "red" }]}>
                                    {isError?.errorPassword?.messErrorPassword !== "" ? isError?.errorPassword?.messErrorPassword :
                                        password && password !== "" ? "Mật khẩu" : ""}
                                </Text>
                            </View>
                            <View style={StylesTheme.onlyFlexDirectionAli_Center}>
                                <TextInputComponent
                                    style={[styles.textInput, {}]}
                                    isError={isError?.errorPassword?.isErrorPassword}
                                    isObligatory={true}
                                    placeholder="Mật khẩu"
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                    secureTextEntry={isPasswordVisibility}
                                    enablesReturnKeyAutomatically
                                    value={password}
                                    isRefresh={isPasswordVisibility}
                                    onComplete={(text) => {
                                        handleOnChangeTextPassword(text);
                                    }}
                                />
                                <TouchableOpacity style={{ position: 'absolute', right: 10 }}
                                    activeOpacity={0.8}
                                    onPress={() => {
                                        setState((prevState: any) => ({
                                            ...prevState,
                                            isPasswordVisibility: !isPasswordVisibility
                                        }));
                                        // setIsPasswordVisibility(!isPasswordVisibility)
                                    }}
                                >
                                    {
                                        isPasswordVisibility ? (
                                            <EyeHideIcon color={"#000"} size={32} />
                                        ) : (
                                            <EyeShowIcon color={"#000"} size={32} />
                                        )
                                    }
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                    {/* remember and forget password */}
                    <View style={StylesTheme.onlyFlexRow_AliCenter_JusSP}>
                        {/* remember */}
                        <View style={{}}>
                            <Pressable
                                style={StylesTheme.onlyFlexDirectionAli_Center}
                                onPress={() => {
                                    setState((prevState: any) => ({
                                        ...prevState,
                                        isRememberPassword: !isRememberPassword
                                    }));
                                    // setIsRememberPassword(!isRememberPassword);
                                }}
                            >
                                <View
                                    style={[styles.styleCheckbox, {
                                        backgroundColor: isRememberPassword ? Colors.primaryColor : '#fff',
                                    }]}
                                />
                                <Text style={{ fontSize: 15 }}>Ghi nhớ mật khẩu</Text>
                            </Pressable>
                        </View>

                        {/* forget */}
                        <View style={{}}>
                            <TouchableOpacity>
                                <Text style={{ color: 'blue', fontSize: 15 }}>Quên mật khẩu</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    {/* Button Login, Login with Facebook or Register */}
                    <View style={{ flex: 1, justifyContent: 'center', marginTop: 24 }}>
                        {/* Button Login */}
                        <View style={{ flex: 1 }}>
                            <TouchableOpacity
                                style={StylesTheme.btnPrimary}
                                onPress={
                                    //handleLogin
                                    () => {
                                        navigation.navigate("BottomTabNavigator", {
                                            // data: dataUser
                                        });
                                    }
                                }
                            >
                                <Text style={styles.textBtnLogin}>
                                    Đăng nhập
                                </Text>
                            </TouchableOpacity>
                        </View>

                        {
                            notification !== "" && (
                                <View style={styles.wrapErrorLogin}>
                                    <Text style={StylesTheme.textError}>{notification}</Text>
                                </View>
                            )
                        }

                        {/* OR */}

                        <View
                            style={[StylesTheme.flexRowCenter, StylesTheme.marginV24]}
                        >
                            <View style={StylesTheme.line30} />
                            <Text
                                style={{
                                    fontSize: 18,
                                    fontWeight: '600',
                                    fontStyle: 'italic',
                                    marginHorizontal: 12,
                                    color: '#ccc',
                                }}
                            >
                                Hoặc
                            </Text>
                            <View style={StylesTheme.line30} />
                        </View>

                        <View
                            style={StylesTheme.flexRowCenter}
                        >

                            {/* Login with google */}
                            <View>
                                <TouchableOpacity
                                    onPress={signInWithGoogle}
                                    style={styles.btnLoginDiff}
                                >
                                    <Image
                                        source={require('../../global/assets/image/google.png')}
                                        style={StylesTheme.wh32}
                                    />
                                </TouchableOpacity>
                            </View>

                            {/* Login with facebook */}
                            <View>
                                <TouchableOpacity
                                    onPress={_signOut}

                                    style={styles.btnLoginDiff}
                                >
                                    <Image
                                        source={require('../../global/assets/image/facebook.png')}
                                        style={StylesTheme.wh32}
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>

                        <View
                            style={styles.wrapNotHaveAccount}
                        >
                            <Text
                                style={styles.textNotHaveAccount}
                            >
                                Bạn chưa có tài khoản?{' '}
                            </Text>
                            <Pressable
                                onPress={() => {
                                    navigation.navigate("Register");
                                }}
                            >
                                <Text
                                    style={styles.textRegister}
                                >
                                    Đăng ký
                                </Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
            </KeyboardAwareScrollView>
        </SafeAreaView>
    )
    // if (gettingLoginStatus) {
    //     return (
    //       <View style={styles.container}>
    //         <ActivityIndicator size="large" color="#0000ff" />
    //       </View>
    //     );
    //   } else {
    //     return (
    //       <SafeAreaView style={{flex: 1}}>
    //         <View style={styles.container}>
    //           <Text style={styles.titleText}>
    //             Example of Google Sign In in React Native
    //           </Text>
    //           <View style={styles.container}>
    //             {userInfo !== null ? (
    //               <>
    //                 <Image
    //                   source={{uri: userInfo.user.photo}}
    //                   style={styles.imageStyle}
    //                 />
    //                 <Text>
    //                   Name: {userInfo.user.name}
    //                 </Text>
    //                 <Text>
    //                   Email: {userInfo.user.email}
    //                 </Text>
    //                 <TouchableOpacity
    //                   style={styles.buttonStyle}
    //                   onPress={_signOut}>
    //                   <Text>Logout</Text>
    //                 </TouchableOpacity>
    //               </>
    //             ) : (
    //               <GoogleSigninButton
    //                 style={{width: 312, height: 48}}
    //                 size={GoogleSigninButton.Size.Wide}
    //                 color={GoogleSigninButton.Color.Light}
    //                 onPress={signInWithGoogle}
    //               />
    //             )}
    //           </View>
    //           <Text style={styles.footerHeading}>
    //             Google SignIn in React Native
    //           </Text>
    //           <Text style={styles.footerText}>
    //             www.aboutreact.com
    //           </Text>
    //         </View>
    //       </SafeAreaView>
    //     );
    //   }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },

    textSlogan: {
        fontSize: 18, fontWeight: '600'
    },

    wrapTextInput: { flex: 1, marginVertical: 24 },

    textInput: {
        flex: 1,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderColor: '#ccc',
        fontSize: 16,
        fontWeight: '500',
    },

    styleCheckbox: {
        width: 22,
        height: 22,
        borderWidth: 1,
        borderColor: '#000',
        borderRadius: 22,
        marginRight: 6,
    },

    textBtnLogin: {
        fontSize: 18, fontWeight: '600', fontStyle: 'italic'
    },

    wrapErrorLogin: { marginTop: 12, alignItems: "center" },

    btnLoginDiff: {
        padding: 12,
        marginHorizontal: 12,
        borderWidth: 2,
        borderColor: '#ccc',
        borderRadius: 6,
    },

    wrapNotHaveAccount: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 24,
    },

    textNotHaveAccount: {
        fontSize: 16,
        fontWeight: '500',
        fontStyle: 'italic',
    },

    textRegister: {
        fontSize: 16,
        fontWeight: '600',
        fontStyle: 'italic',
        color: 'blue',
    },

    textSubTitle: {
        color: Colors.colorGrey,
        fontWeight: '500',
    }
});