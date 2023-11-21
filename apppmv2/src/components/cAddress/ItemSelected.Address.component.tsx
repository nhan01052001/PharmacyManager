import React, { useCallback, useEffect, useState } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
} from 'react-native';
import { Province } from './Address.component';
import StylesTheme from '../../global/theme/Styles.Theme';
import { Colors } from '../../global/theme/Colors.Theme';
import Function from '../../service/Function.Service';

interface IProps {
    value?: Province;
    isHaveValue?: boolean,
    isFocus?: boolean,
    onFocus?: () => void,
    isRefresh?: boolean,
    onChooseItem?: (value?: Province) => void,
    // also contains all props of the TextInput component
}

const ItemSelected: React.FC<IProps> = (props: IProps) => {
    const { value, isHaveValue, isFocus, onFocus, isRefresh, onChooseItem } = props;
    
    return (
        <View style={[styles.wrapItem, isFocus && styles.wrapItemNotHaveValue]}>
            <View style={[StylesTheme.circle18, styles.wrapDotSmall, isFocus && [StylesTheme.circle22, styles.wrapDotNotHaveValue]]}>
                <View style={[styles.dot, isFocus && {backgroundColor: Colors.primaryColor}]} />
            </View>
            <TouchableOpacity
            style={styles.btn}
            activeOpacity={0.9}
            disabled={isFocus}
            onPress={() => {
                if(onFocus) {
                    onFocus()
                }
            }}
            >
                <Text style={[styles.textItem, isFocus && {color: Colors.primaryColor}]}>{value?.full_name}</Text>
            </TouchableOpacity>
        </View>
    )
};

const styles = StyleSheet.create({
    wrapItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 12,
        paddingLeft: 10
    },

    wrapItemNotHaveValue: {
        paddingLeft: 6,
        borderWidth: 1,
        borderColor: "#ccc",
        backgroundColor: Colors.clWhite,
    },

    wrapDotNotHaveValue: {
        borderColor: Colors.primaryColor,
        borderWidth: 1,
    },

    wrapDotLarge: {
        borderColor: Colors.primaryColor,
        borderWidth: 1,
    },

    wrapDotSmall: {
        backgroundColor: Colors.clWhite, 
        justifyContent: 'center', 
        alignItems: 'center'
    },

    dot: {
        width: 12, 
        height: 12, 
        borderRadius: 12, 
        backgroundColor: '#ebebeb'
    },

    textItem: {
        fontSize: 16,
        fontWeight: '400'
    },

    btn: {
        flex: 1,
        padding: 12,
        marginLeft: 12,
    }
});

export default React.memo(ItemSelected, (prevProps, nextProps) => {
    return Function.compare(prevProps.value, nextProps.value) && prevProps?.isFocus === nextProps?.isFocus && prevProps?.isHaveValue === nextProps?.isHaveValue ? true : false;
});