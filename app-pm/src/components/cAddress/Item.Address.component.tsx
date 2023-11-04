import React, { useCallback, useEffect, useState } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
} from 'react-native';
import { Province } from './Address.component';
import StylesTheme from '../../global/theme/Styles.Theme';
import { TickIcon, RightArowIcon } from '../../global/icon/Icon';
import { Colors } from '../../global/theme/Colors.Theme';

interface IProps {
    value?: Province;
    onChooseItem: (value?: Province) => void,
    // also contains all props of the TextInput component
}

const ItemAddress: React.FC<IProps> = (props: IProps) => {
    const { value, onChooseItem } = props;

    return (
        <View style={{ flex: 1 }}>
            <View style={StylesTheme.onlyFlexDirectionAli_Center}>
                <View style={{ flex: 1, paddingLeft: 12, }}>
                    <TouchableOpacity style={[styles.item, value?.isSelect && {paddingRight: 12}]} onPress={() => {
                        onChooseItem(value)
                    }}>
                        <Text>{value?.full_name}</Text>
                        {
                            value?.isSelect && (
                                <TickIcon color={Colors.primaryColor} size={22} />
                            )
                        }
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
};

const styles = StyleSheet.create({
    item: {
        flex: 1,
        borderBottomColor: '#ccc',
        borderBottomWidth: 1,
        paddingVertical: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    }
});

export default React.memo(ItemAddress, (prevProps, nextProps) => {
    return prevProps.value === nextProps.value ? true : false;
});