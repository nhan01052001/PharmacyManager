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

interface Props extends React.ComponentProps<typeof TextInput> {
    customPropsOne?: string;
    isSubTitle?: boolean;
    styleCustom?: any;
    isClose?: boolean;
    onComplete: (text: string) => void,
    // also contains all props of the TextInput component
}

const TextInputComponent: React.FC<Props> = (props: Props) => {
    const { customPropsOne, isSubTitle, styleCustom, isClose, ...rest } = props;
    const [isFocus, setIsFocus] = useState<boolean>(false);

    console.log('re-render');

    const handleFocusTextInput = useCallback((value: boolean) => {
        setIsFocus(value);
    }, []);

    return (

        <View style={{ flex: 1 }}>
            <View style={[isSubTitle && isFocus && [styles.textInput, { padding: 0 }], { flexDirection: 'row', alignItems: 'center' }]}>
                <View style={{ flex: 1 }}>
                    {
                        isSubTitle && isFocus && (
                            <View style={{ position: 'absolute', left: 16, top: 4, }}>
                                <Text style={{ fontSize: 13, fontWeight: "400" }}>{rest.placeholder}</Text>
                            </View>
                        )
                    }
                    <View style={isSubTitle && isFocus && { paddingTop: 16 }}>
                        <TextInput
                            {
                            ...rest
                            }
                            style={isSubTitle && isFocus ? [{
                                borderRadius: 24,
                                paddingVertical: 8,
                                paddingHorizontal: 16,
                                fontSize: 15,
                                fontWeight: "500",
                            }] : rest.style}
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
                    isClose && rest.value && rest.value !== '' ? (
                        <TouchableOpacity style={{ paddingHorizontal: 8 }} onPress={() => {
                            rest.onComplete('');
                            // if (isSubTitle && (rest.value || rest.value !== '')) {
                            //     handleFocusTextInput(false);
                            // }
                            // Keyboard.dismiss();
                        }}>
                            <Image source={require('../../global/assets/image/close.png')} style={{ width: 18, height: 18 }} />
                        </TouchableOpacity>
                    ) : null
                }
            </View>
        </View>
    )
}

export default React.memo(TextInputComponent, (prevProps, nextProps) => {
    return prevProps.value === nextProps.value;
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
});