import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, TextInput } from 'react-native';
import TextInputComponent from '../cTextInput/TextInput.component';

import { SearchIcon } from '../../global/icon/Icon';

interface IProps {
    propsPlaceholder?: any;
    propsValue?: any;
    propsOnChangeText?: any;
    propsStyleWrapTextInput?: any;
    propsStyleTextInput?: any;
    propsMargin?: any;
}

const Search: React.FC<IProps> = (props: IProps) => {

    const {
        propsPlaceholder,
        propsValue,
        propsOnChangeText,
        propsStyleWrapTextInput,
        propsStyleTextInput,
        propsMargin,
    } = props;

    return (
        <View style={[styles.container, { ...propsMargin }]}>
            <View style={[styles.wrapTextInput, { ...propsStyleWrapTextInput }]}>
                <TextInputComponent
                    value={propsValue}
                    onComplete={(text) => {
                        propsOnChangeText(text);
                    }}
                    placeholder={propsPlaceholder}
                    placeholderTextColor="#ccc"
                    style={[styles.textInput, { ...propsStyleTextInput }]}
                />
                <View style={{ padding: 8 }}>
                    <SearchIcon color="#000" size={30} />
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
    },

    wrapTextInput: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
        width: '80%',
        borderRadius: 8,
    },

    textInput: {
        flex: 1,
        fontSize: 18,
        fontWeight: '500',
        color: '#000',
        padding: 14,
    },
});

export default Search;