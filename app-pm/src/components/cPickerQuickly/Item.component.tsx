import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal, Pressable, FlatList } from 'react-native';

import Function from '../../service/Function.Service';
import StylesTheme, { height } from '../../global/theme/Styles.Theme';
import { RightArowIcon } from '../../global/icon/Icon';
import { Colors } from '../../global/theme/Colors.Theme';


interface IProps {
    value: any;
    isRefresh?: boolean;
    onComplete: (value: any) => void;
}

const Item: React.FC<IProps> = (props: IProps) => {

    const { value, onComplete } = props;
    console.log(value, value.isChecked, 'value?.isChecked');
    return (
        <View>
            <TouchableOpacity
                style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingVertical: 16,
                    borderBottomColor: '#ccc',
                    borderBottomWidth: 0.5,
                }}
                onPress={() => onComplete(value)}
            >
                <Text style={[StylesTheme.text14, {fontSize: 16}]} numberOfLines={2}>
                    {value?.name}
                </Text>
                <View
                    style={{
                        width: 26,
                        height: 26,
                        borderWidth: 1,
                        borderColor: '#000',
                        borderRadius: 22,
                        marginRight: 6,
                        padding: 3,
                    }}
                >
                    <View
                        style={[
                            { flex: 1, borderRadius: 22, backgroundColor: '#fff' },
                            value?.isChecked === true && { backgroundColor: Colors.primaryColor },
                        ]}
                    ></View>
                </View>
            </TouchableOpacity>
        </View>
    )
}

export default  React.memo(Item, (prevProps, nextProps) => {
    return Function.compare(prevProps.value, nextProps.value);
})