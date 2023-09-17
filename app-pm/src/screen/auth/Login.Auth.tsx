import { useNavigation } from '@react-navigation/core';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useCallback, useState, Reducer, useReducer } from 'react';
import {
    SafeAreaView,
    StyleSheet,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    Dimensions,
    KeyboardAvoidingView,
    ViewBase,
    Keyboard,
    Platform,
    Pressable,
    Alert,
    Image,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import { MainStackParams } from '../../navigation/Stack.Navigator';
import StylesTheme, { Colors } from '../../global/theme/Styles.Theme';
import Function from '../../global/assets/service/Function.Service';
import { EyeHideIcon, EyeShowIcon } from '../../global/icon/Icon';
import TextInputComponent from '../../components/cTextInput/TextInput.component';

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
    console.log("loading");

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
                            <View style={[StylesTheme.onlyFlexRow_AliCenter_JusSP, { marginVertical: 4 }]}>
                                {
                                    /* isError?.errorUsername?.isErrorUsername && 
                                    isError?.errorUsername?.messErrorUsername !== "" ? */ (
                                        <Text numberOfLines={2} style={{ color: "red" }}>{isError?.errorUsername?.messErrorUsername} </Text>
                                    )
                                }
                            </View>
                            <TextInputComponent
                                style={[styles.textInput, {}]}
                                // styleCustom={[styles.textInput, {}]}
                                placeholder="Số điện thoại hoặc email"
                                keyboardType={'numeric'}
                                value={username}
                                isError={isError?.errorUsername?.isErrorUsername}
                                onComplete={(text) => {
                                    handleOnChangeTextUsername(text);
                                }}
                                isSubTitle={true}
                                isClose={true}
                            />
                        </View>

                        {/* password */}
                        <View>
                            <View style={[StylesTheme.onlyFlexRow_AliCenter_JusSP, { marginVertical: 4 }]}>
                                {
                                    /* isError?.errorPassword?.isErrorPassword && 
                                    isError?.errorPassword?.messErrorPassword !== "" ? */ (
                                        <Text numberOfLines={2} style={{ color: "red" }}>{isError?.errorPassword?.messErrorPassword} </Text>
                                    )
                                }
                            </View>
                            <View style={StylesTheme.onlyFlexDirectionAli_Center}>
                                <TextInputComponent
                                    style={[styles.textInput, {}]}
                                    isSubTitle={true}
                                    isError={isError?.errorPassword?.isErrorPassword}
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
                                onPress={() => {
                                    //this.handleLogin()
                                }}
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
                            {/* Login with facebook */}
                            <View>
                                <TouchableOpacity
                                    style={styles.btnLoginDiff}
                                >
                                    <Image
                                        source={require('../../global/assets/image/google.png')}
                                        style={StylesTheme.wh32}
                                    />
                                </TouchableOpacity>
                            </View>

                            {/* Login with google */}
                            <View>
                                <TouchableOpacity
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
        padding: 14,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 24,
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
    }
});