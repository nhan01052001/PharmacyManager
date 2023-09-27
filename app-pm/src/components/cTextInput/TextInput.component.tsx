import React, { useCallback, useState } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Image,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import StylesTheme from '../../global/theme/Styles.Theme';
import { WarningIcon } from '../../global/icon/Icon';

interface IProps extends React.ComponentProps<typeof TextInput> {
    customPropsOne?: string;
    isClose?: boolean;
    isError?: boolean;
    isShowIconError?: boolean;
    isRefresh?: boolean;
    isObligatory?: boolean,
    onComplete: (text: string) => void,
    // also contains all props of the TextInput component
}

const TextInputComponent: React.FC<IProps> = (props: IProps) => {
    const { customPropsOne, isClose, isError, isShowIconError, isObligatory, isRefresh, ...rest } = props;
    const isShowOption = isObligatory || (isShowIconError && isError) || (isClose && rest.value && rest.value !== '') ? true : false;
    
    return (

        <View style={{ flex: 1 }}>
            <View style={[{ padding: 0 },
            StylesTheme.onlyFlexDirectionAli_Center,
            isShowOption && rest.style,
            isError && { borderColor: 'red'},
            ]}>
                <View style={{ flex: 1 }}>
                    <View>
                        <TextInput
                            {
                            ...rest
                            }
                            style={[ !isShowOption && rest.style, StylesTheme.sizeTextSmall]}
                            placeholder={props.placeholder}
                            value={rest.value}
                            onChangeText={(text) => {
                                rest.onComplete(text)
                            }}
                        />
                    </View>
                </View>
                {
                    isShowOption ? (
                        <TouchableOpacity style={{ paddingHorizontal: 8 }} disabled={(isShowIconError && isError) || (isObligatory && rest.value === '')} onPress={() => {
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
                                ) : isObligatory && rest.value === '' ? (
                                    <Text style={{color: 'red'}}>*</Text>
                                ) : null
                            }
                        </TouchableOpacity>
                    ) : null
                }
            </View>
        </View>
    )
}

// export default React.memo(TextInputComponent, (prevProps, nextProps) => {
//     return prevProps.isRefresh  !== nextProps.isRefresh ? false : prevProps.value === nextProps.value ? true : false;
//     // return prevProps.value === nextProps.value ? true : false;
// });

export default TextInputComponent;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },

    noSubTitle: {
        paddingVertical: 8,
        fontWeight: "500",
        borderWidth: 0,
    },

    subTitle: {
        position: 'absolute',
        top: 4,
    },

    textSubTitle: {
        fontWeight: "400"
    }
});