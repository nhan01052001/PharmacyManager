import { useNavigation } from '@react-navigation/core';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useState, useCallback } from 'react';
import {
    SafeAreaView,
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    Pressable,
    Image,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import { MainStackParams } from '../../navigation/Stack.Navigator';
import Function from '../../global/assets/service/Function.Service';
import StylesTheme from '../../global/theme/Styles.Theme';
import TextInputComponent from '../../components/cTextInput/TextInput.component';
import { EyeHideIcon, EyeShowIcon } from '../../global/icon/Icon';
import { Account, User } from '../../type/User.Type';
import { Colors } from '../../global/theme/Colors.Theme';
import { ENUM } from '../../global/enum';
import { AlertService } from '../../components/cAlert/Alert.component';

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

type State = {
    account: Account,
    isError: ErrorAccount,
    isPasswordVisibility: boolean;
    isConfirmPasswordVisibility: boolean;
    isRefreshConfirmPassword: boolean;
}

const initialState: State = {
    account: {
        username: null,
        password: null,
        confirmPassword: null
    },
    isError: {
        errorUsername: {
            isErrorUsername: false,
            messErrorUsername: ''
        },
        errorPassword: {
            isErrorPassword: false,
            messErrorPassword: ''
        },
        errorConfirmPassword: {
            isErrorConfirmPassword: false,
            messErrorConfirmPassword: ''
        }
    },
    isPasswordVisibility: true,
    isConfirmPasswordVisibility: true,
    isRefreshConfirmPassword: false,
};

export const Register: React.FC<{ route: any }> = ({ route }) => {
    const navigation = useNavigation<StackNavigationProp<MainStackParams>>();
    const [{ account, isError, isPasswordVisibility, isConfirmPasswordVisibility, isRefreshConfirmPassword }, setState] = useState<State>({ ...initialState });

    const handleOnChangeTextUsername = useCallback((text: any) => {
        let nextState = {};
        if (text.length === 0) {
            nextState = {
                errorUsername: {
                    isErrorUsername: true,
                    messErrorUsername: "Tài khoản không được để trống!"
                }
            }
        } else {
            nextState = {
                errorUsername: {
                    isErrorUsername: false,
                    messErrorUsername: ""
                }
            }
        }

        setState((prevState: any) => ({
            ...prevState,
            account: {
                ...prevState?.account,
                username: text,
            },
            isError: {
                ...prevState?.isError,
                ...nextState
            }
        }));
    }, [account.username]);

    const handleOnChangeTextPassword = useCallback((text: any) => {
        let nextState = {};
        if (text.length === 0) {
            nextState = {
                errorPassword: {
                    isErrorPassword: true,
                    messErrorPassword: "Mật khẩu không được để trống!"
                }
            }
        } else {
            if (Function.isValidPassword(text)) {
                nextState = {
                    errorPassword: {
                        isErrorPassword: false,
                        messErrorPassword: ""
                    }
                }
            } else {
                nextState = {
                    errorPassword: {
                        isErrorPassword: true,
                        messErrorPassword: "Mật khẩu bao gồm 6 - 20 ký tự, có ít nhất một chữ số và một ký tự đặc biệt"
                    }
                }
            }
        }

        setState((prevState: State) => ({
            ...prevState,
            account: {
                ...prevState?.account,
                password: text,
            },
            isError: {
                ...prevState?.isError,
                ...nextState
            },
            isRefreshConfirmPassword: !prevState.isRefreshConfirmPassword
        }));
    }, [account.password]);

    const handleOnChangeTextConfirmPassword = useCallback((text: any) => {
        let nextState = {};
        if (text.length === 0) {
            nextState = {
                errorConfirmPassword: {
                    isErrorConfirmPassword: true,
                    messErrorConfirmPassword: "Xác nhân mật khẩu không được để trống!"
                }
            }
        } else {
            if (account.password !== text) {
                nextState = {

                    errorConfirmPassword: {
                        isErrorConfirmPassword: true,
                        messErrorConfirmPassword: "Xác nhận mật khẩu chưa hợp lệ!"
                    }
                }
            } else {
                nextState = {

                    errorConfirmPassword: {
                        isErrorConfirmPassword: false,
                        messErrorConfirmPassword: ""
                    }
                }
            }
        }
        setState((prevState: State) => ({
            ...prevState,
            account: {
                ...prevState?.account,
                confirmPassword: text,
            },
            isError: {
                ...prevState?.isError,
                ...nextState
            }
        }));
    }, [account.confirmPassword]);

    const handleContinue = () => {
        if (account.username
            && account.password
            && account.confirmPassword
            && !isError.errorUsername.isErrorUsername
            && !isError.errorPassword.isErrorPassword
            && !isError.errorConfirmPassword.isErrorConfirmPassword
        ) {

            if (!Function.isValidNumberPhone(account.username)) {
                setState((prevState: any) => ({
                    ...prevState,
                    isError: {
                        ...prevState?.isError,
                        errorUsername: {
                            isErrorUsername: true,
                            messErrorUsername: "Tài khoản không hợp lệ!"
                        }
                    }
                }));
                AlertService.show(ENUM.E_ERROR, 'Vui lòng nhập số điện thoại của bạn!', 3000, 'Thông tin đăng ký không hợp lệ!');
                return;
            }

            navigation.navigate("OTP", {
                username: account.username,
                password: account.password,
            });
        } else {
            AlertService.show(ENUM.E_ERROR, 'Vui lòng nhập đầy đủ thông tin yêu cầu!', 3000, 'Thông tin đăng ký không hợp lệ!');
        }
    }

    return (
        <SafeAreaView style={[styles.container, StylesTheme.droidSafeArea]}>
            <KeyboardAwareScrollView style={StylesTheme.flexW100}>
                <View style={StylesTheme.paddingH24}>
                    {/* logo and slogan */}
                    <View style={StylesTheme.flexCenter}>
                        <Image source={require('../../global/assets/image/logo.png')} style={StylesTheme.sizeLogo} />
                        <Text style={styles.textSlogan}>Shmily</Text>
                    </View>
                    {/* TextInput username, password, confirm password */}
                    <View style={styles.wrapTextInput}>
                        {/* username */}
                        <View>
                            <View style={[StylesTheme.onlyFlexRow_AliCenter_JusSP, { marginVertical: 2 }]}>
                                <Text numberOfLines={2} style={[styles.textSubTitle, isError?.errorUsername?.messErrorUsername !== "" && { color: "red" }]}>
                                    {isError?.errorUsername?.messErrorUsername !== "" ? isError?.errorUsername?.messErrorUsername :
                                        account.username && account.username !== "" ? "Số điện thoại" : ""}
                                </Text>
                            </View>
                            <TextInputComponent
                                style={[styles.textInput, {}]}
                                placeholder="Số điện thoại"
                                keyboardType={'numeric'}
                                value={account.username}
                                isError={isError?.errorUsername?.isErrorUsername}
                                isClose={true}
                                onComplete={(text) => {
                                    handleOnChangeTextUsername(text);
                                }}
                            />
                        </View>

                        {/* password */}
                        <View style={{ marginVertical: 24 }}>
                            <View style={[StylesTheme.onlyFlexRow_AliCenter_JusSP, { marginVertical: 2 }]}>
                                <Text numberOfLines={2} style={[styles.textSubTitle, isError?.errorPassword?.messErrorPassword !== "" && { color: "red" }]}>
                                    {isError?.errorPassword?.messErrorPassword !== "" ? isError?.errorPassword?.messErrorPassword :
                                        account.password && account.password !== "" ? "Mật khẩu" : ""}
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
                                    value={account.password}
                                    isRefresh={isPasswordVisibility}
                                    onComplete={(text) => {
                                        handleOnChangeTextPassword(text);
                                    }}
                                />
                                <TouchableOpacity style={{ position: 'absolute', right: 10 }}
                                    activeOpacity={0.8}
                                    onPress={() => {
                                        // setIsPasswordVisibility(!isPasswordVisibility)
                                        setState((prevState: any) => ({
                                            ...prevState,
                                            isPasswordVisibility: !isPasswordVisibility
                                        }));
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

                        {/* confirm password */}
                        <View>
                            <View style={[StylesTheme.onlyFlexRow_AliCenter_JusSP, { marginVertical: 2 }]}>
                                <Text numberOfLines={2} style={[styles.textSubTitle, isError.errorConfirmPassword.messErrorConfirmPassword !== "" && { color: "red" }]}>
                                    {isError.errorConfirmPassword.messErrorConfirmPassword !== "" ? isError.errorConfirmPassword.messErrorConfirmPassword :
                                        account.confirmPassword && account.confirmPassword !== "" ? "Xác nhận mật khẩu" : ""}
                                </Text>
                            </View>
                            <View style={StylesTheme.onlyFlexDirectionAli_Center}>
                                <TextInputComponent
                                    style={[styles.textInput, account.password ? {} : { backgroundColor: "#ebebeb" }]}
                                    isError={isError?.errorConfirmPassword?.isErrorConfirmPassword}
                                    isObligatory={true}
                                    placeholder="Xác nhận mật khẩu"
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                    secureTextEntry={isConfirmPasswordVisibility}
                                    editable={account.password ? true : false}
                                    enablesReturnKeyAutomatically
                                    value={account.confirmPassword}
                                    isRefresh={isRefreshConfirmPassword}
                                    onComplete={(text) => {
                                        handleOnChangeTextConfirmPassword(text);
                                    }}
                                />
                                <TouchableOpacity style={{ position: 'absolute', right: 10 }}
                                    activeOpacity={0.8}
                                    disabled={account.password ? false : true}
                                    onPress={() => {
                                        setState((prevState: any) => ({
                                            ...prevState,
                                            isConfirmPasswordVisibility: !isConfirmPasswordVisibility,
                                            isRefreshConfirmPassword: !isRefreshConfirmPassword,
                                        }));
                                    }}
                                >
                                    {
                                        isConfirmPasswordVisibility ? (
                                            <EyeHideIcon color={"#000"} size={32} />
                                        ) : (
                                            <EyeShowIcon color={"#000"} size={32} />
                                        )
                                    }

                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                    {/* Button Continue, Continue with Facebook or Login */}
                    <View style={styles.wrapButtonDiff}>
                        {/* Button Continue */}
                        <View style={{ flex: 1 }}>
                            <TouchableOpacity
                                style={[StylesTheme.btnPrimary, !(account.username && account.password && account.confirmPassword) && { backgroundColor: Colors.colorGrey }]}
                                disabled={!(account.username && account.password && account.confirmPassword) ? true : false}
                                onPress={() => {
                                    handleContinue();
                                }
                                }
                            >
                                <Text style={styles.textBtnLogin}>
                                    Tiếp theo
                                </Text>
                            </TouchableOpacity>
                        </View>

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
                                Tiếp tục với
                            </Text>
                            <View style={StylesTheme.line30} />
                        </View>

                        <View
                            style={StylesTheme.flexRowCenter}
                        >
                            {/* Continue with google */}
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

                            {/* Continue with facebook */}
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
                                Bạn đã có tài khoản?{' '}
                            </Text>
                            <Pressable>
                                <Text
                                    style={styles.textRegister}
                                >
                                    Đăng nhập
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

    wrapButtonDiff: {
        flex: 1, justifyContent: 'center', marginTop: 12
    },

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