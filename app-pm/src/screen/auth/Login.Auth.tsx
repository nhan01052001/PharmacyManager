import { useNavigation } from '@react-navigation/core';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useCallback, useState } from 'react';
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
import StylesTheme from '../../global/theme/ Styles.Theme';
import Function from '../../global/assets/service/Function.Service';
import { EyeHideIcon, EyeShowIcon } from '../../global/icon/Icon';
import TextInputComponent from '../../components/cTextInput/TextInput.component';


export const Login: React.FC = () => {
    const navigation = useNavigation<StackNavigationProp<MainStackParams>>();
    const [valueUserName, setValueUserName] = useState<string>("");
    const [valuePassword, setValuePassword] = useState<string>("");
    const [showErrorUserName, setShowErrorUserName] = useState<string>("");
    const [notification, setNotification] = useState<string>("");
    const [showErrorPassword, setShowErrorPassword] = useState<string>("");
    const [isRememberPassword, setIsRememberPassword] = useState<boolean>(false);
    const [isPasswordVisibility, setIsPasswordVisibility] = useState<boolean>(true);

    const handleOnChangeText = useCallback((text: any) => {
        if (text.length === 0) {
            setShowErrorUserName("Số điện thoại không được bỏ trống!");
        } else {
            if (!Function.isValidNumberPhone(text)) {
                setShowErrorUserName("Số điện thoại không hợp lệ!");
            } else {
                setShowErrorUserName("");
            }
        }
        setValueUserName(text);
    }, [valueUserName])

    return (
        <SafeAreaView style={[styles.container, StylesTheme.droidSafeArea]}>
            <KeyboardAwareScrollView style={{ flex: 1, width: '100%' }}>
                <View style={{ paddingHorizontal: 24 }}>
                    {/* logo and slogan */}
                    <View
                        style={{
                            flex: 1,
                            alignItems: 'center',
                            justifyContent: 'flex-start',
                        }}
                    >
                        <Image source={require('../../global/assets/image/logo.png')} style={{ width: 200, height: 132 }} />
                        <Text style={{ fontSize: 18, fontWeight: '600' }}>My slogan</Text>
                    </View>

                    {/* TextInput username, password */}
                    <View style={{ flex: 1, marginVertical: 24 }}>
                        {/* username */}
                        <View style={{ marginVertical: 24 }}>
                            {/* <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                                {
                                    showErrorUserName !== "" && (
                                        <Text style={{ color: "red" }}>{showErrorUserName}</Text>
                                    )
                                }
                            </View> */}

                            <TextInputComponent
                                style={[styles.textInput, {}]}
                                // styleCustom={[styles.textInput, {}]}
                                placeholder="Số điện thoại hoặc email"
                                keyboardType={'numeric'}
                                value={valueUserName}
                                onComplete={(text) => {
                                    handleOnChangeText(text);
                                }}
                                isSubTitle={true}
                                isClose={true}
                            />
                        </View>

                        {/* password */}
                        <View>
                            {/* <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                                {
                                    showErrorPassword !== "" && (
                                        <Text style={{ color: "red" }}>{showErrorPassword}</Text>
                                    )
                                }
                            </View> */}
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <TextInputComponent
                                    style={[styles.textInput, {}]}
                                    isSubTitle={true}
                                    placeholder="Mật khẩu"
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                    secureTextEntry={isPasswordVisibility}
                                    enablesReturnKeyAutomatically
                                    value={valuePassword}
                                    onComplete={(text) => {
                                        setValuePassword(text);
                                    }}
                                />
                                <TouchableOpacity style={{ position: 'absolute', right: 10 }}
                                    activeOpacity={0.8}
                                    onPress={() => {
                                        setIsPasswordVisibility(!isPasswordVisibility)
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
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        {/* remember */}
                        <View style={{}}>
                            <Pressable
                                style={{ flexDirection: 'row', alignItems: 'center' }}
                                onPress={() => { }}
                            >
                                <View
                                    style={{
                                        width: 22,
                                        height: 22,
                                        borderWidth: 1,
                                        borderColor: 'red',
                                        borderRadius: 22,
                                        marginRight: 6,
                                        backgroundColor: isRememberPassword ? 'green' : '#fff',
                                    }}
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
                                style={{
                                    flex: 1,
                                    backgroundColor: '#5BC57E',
                                    paddingVertical: 14,
                                    borderRadius: 20,
                                    alignItems: 'center',
                                }}
                                onPress={() => {
                                    //this.handleLogin()
                                }}
                            >
                                <Text style={{ fontSize: 18, fontWeight: '600', fontStyle: 'italic' }}>
                                    Đăng nhập
                                </Text>
                            </TouchableOpacity>
                        </View>

                        {
                            notification !== "" && (
                                <View style={{ marginTop: 12, alignItems: "center" }}>
                                    <Text style={{ fontSize: 18, fontWeight: "600", color: "red", textAlign: "center" }}>{notification}</Text>
                                </View>
                            )
                        }

                        {/* OR */}

                        <View
                            style={{
                                flexDirection: 'row',
                                justifyContent: 'center',
                                alignItems: 'center',
                                marginVertical: 24,
                            }}
                        >
                            <View style={{ width: '30%', height: 1, backgroundColor: '#ccc' }} />
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
                            <View style={{ width: '30%', height: 1, backgroundColor: '#ccc' }} />
                        </View>

                        <View
                            style={{
                                flexDirection: 'row',
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                        >
                            {/* Login with facebook */}
                            <View>
                                <TouchableOpacity
                                    style={{
                                        padding: 12,
                                        marginHorizontal: 12,
                                        borderWidth: 2,
                                        borderColor: '#ccc',
                                        borderRadius: 6,
                                    }}
                                >
                                    <Image
                                        source={require('../../global/assets/image/google.png')}
                                        style={{ width: 32, height: 32 }}
                                    />
                                </TouchableOpacity>
                            </View>

                            {/* Login with google */}
                            <View>
                                <TouchableOpacity
                                    style={{
                                        padding: 12,
                                        marginHorizontal: 12,
                                        borderWidth: 2,
                                        borderColor: '#ccc',
                                        borderRadius: 6,
                                    }}
                                >
                                    <Image
                                        source={require('../../global/assets/image/facebook.png')}
                                        style={{ width: 32, height: 32 }}
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>

                        <View
                            style={{
                                flexDirection: 'row',
                                justifyContent: 'center',
                                alignItems: 'center',
                                marginVertical: 24,
                            }}
                        >
                            <Text
                                style={{
                                    fontSize: 16,
                                    fontWeight: '500',
                                    fontStyle: 'italic',
                                }}
                            >
                                Bạn chưa có tài khoản?{' '}
                            </Text>
                            <TouchableOpacity>
                                <Text
                                    style={{
                                        fontSize: 16,
                                        fontWeight: '600',
                                        fontStyle: 'italic',
                                        color: 'blue',
                                    }}
                                    onPress={() => {
                                        // this.props.navigation.navigate('Register')
                                    }
                                    }
                                >
                                    Đăng ký
                                </Text>
                            </TouchableOpacity>
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

    textInput: {
        flex: 1,
        padding: 14,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 24,
        fontSize: 16,
        fontWeight: '500',
    },
});