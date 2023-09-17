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
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import StylesTheme from '../../global/theme/Styles.Theme';
import { WarningIcon } from '../../global/icon/Icon';

interface IProps extends React.ComponentProps<typeof TextInput> {
    customPropsOne?: string;
    isSubTitle?: boolean;
    styleCustom?: any;
    isClose?: boolean;
    isError?: boolean;
    isShowIconError?: boolean;
    isRefresh?: boolean;
    onComplete: (text: string) => void,
    // also contains all props of the TextInput component
}

const TextInputComponent: React.FC<IProps> = (props: IProps) => {
    const { customPropsOne, isSubTitle, styleCustom, isClose, isError, isShowIconError, isRefresh, ...rest } = props;
    const [isFocus, setIsFocus] = useState<boolean>(false);

    const handleFocusTextInput = useCallback((value: boolean) => {
        setIsFocus(value);
    }, []);
    
    return (

        <View style={{ flex: 1 }}>
            <View style={[ /* isSubTitle && isFocus && */[rest.style, { padding: 0 }],
            StylesTheme.onlyFlexDirectionAli_Center, isError && { borderColor: 'red', }]}>
                <View style={{ flex: 1 }}>
                    {
                        isSubTitle && isFocus && (
                            <View style={styles.subTitle}>
                                <Text style={[styles.textSubTitle, StylesTheme.sizeTextMini]}>{rest.placeholder}</Text>
                            </View>
                        )
                    }
                    <View style={isSubTitle && isFocus && { paddingTop: 16 }}>
                        <TextInput
                            {
                            ...rest
                            }
                            style={[isSubTitle && isFocus ? [styles.noSubTitle] : rest.style, { borderWidth: 0, }, StylesTheme.sizeTextSmall]}
                            placeholder={isSubTitle && isFocus ? '' : props.placeholder}
                            value={rest.value}
                            onChangeText={(text) => {
                                rest.onComplete(text)
                            }}
                            onFocus={() => {
                                if (isSubTitle) {
                                    handleFocusTextInput(true);
                                }
                            }}
                            onBlur={() => {
                                if (isSubTitle && (!rest.value || rest.value === '')) {
                                    handleFocusTextInput(false);
                                }
                            }}
                        />
                    </View>
                </View>
                {
                    (isShowIconError && isError) || (isClose && rest.value && rest.value !== '') ? (
                        <TouchableOpacity style={{ paddingHorizontal: 8 }} disabled={isShowIconError && isError} onPress={() => {
                            rest.onComplete('');
                            // if (isSubTitle && (rest.value || rest.value !== '')) {
                            //     handleFocusTextInput(false);
                            // }
                            // Keyboard.dismiss();
                        }}>
                            {
                                isShowIconError && isError ? (
                                    <WarningIcon size={28} color='red' />
                                ) : isClose && rest.value && rest.value !== '' ? (
                                    <Image source={require('../../global/assets/image/close.png')} style={StylesTheme.wh18} />
                                ) : null
                            }
                        </TouchableOpacity>
                    ) : null
                }
            </View>
        </View>
    )
}

export default React.memo(TextInputComponent, (prevProps, nextProps) => {
    return prevProps.isRefresh  !== nextProps.isRefresh ? false : prevProps.value === nextProps.value ? true : false;
    // return prevProps.value === nextProps.value ? true : false;
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },

    textInput: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#7d7d7d',
        borderRadius: 24,
    },

    noSubTitle: {
        borderRadius: 24,
        paddingVertical: 8,
        paddingHorizontal: 16,
        fontWeight: "500",
    },

    subTitle: {
        position: 'absolute',
        left: 16,
        top: 4,
    },

    textSubTitle: {
        fontWeight: "400"
    }
});