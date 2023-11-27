import React, { useState, } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, Image } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import StylesTheme from '../../global/theme/Styles.Theme';

interface IProps {
    value?: number;
    limit?: number;
    isRefresh?: boolean;
    onComplete: (value: number) => void,
}

const Quantity: React.FC<IProps> = (props: IProps) => {
    const { value, onComplete } = props;


    const handleIncrease = () => {
        if (value) {
            onComplete(Number(value) + 1);
        }
    };

    const handleReduce = () => {
        if (value && value !== 1) {
            onComplete(Number(value) - 1);
        }
    };

    return (
        <View style={[StylesTheme.onlyFlexDirectionAli_Center, {  marginLeft: 12, }]}>
            <TouchableOpacity onPress={() => handleReduce()}>
                <Image source={require('../../global/assets/image/minus-sign.png')} style={StylesTheme.wh18} />
            </TouchableOpacity>
            <View style={{ paddingHorizontal: 12 }}>
                <TextInput
                    style={{
                        paddingVertical: 4,
                        paddingHorizontal: 16,
                        borderWidth: 0.5,
                        borderColor: '#ccc',
                    }}
                    keyboardType={'numeric'}
                    value={`${value}`}
                    onChangeText={(text) => {
                        onComplete(Number(text));
                    }}
                />
            </View>
            <TouchableOpacity onPress={() => handleIncrease()}>
                <Image source={require('../../global/assets/image/plus.png')} style={StylesTheme.wh18} />
            </TouchableOpacity>
        </View>
    )
}

export default React.memo(Quantity, (prevProps, nextProps) => {
    return (prevProps.value !== nextProps.value) || (prevProps.isRefresh !== nextProps.isRefresh) ? false : true;
});