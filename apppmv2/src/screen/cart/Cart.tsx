import { useNavigation } from '@react-navigation/core';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useEffect, useState } from 'react';
import {
    StyleSheet,
    Text,
    View,
    SafeAreaView,
    ScrollView,
    Pressable,
    TouchableOpacity,
    Image
} from 'react-native';

import { HeaderComponent } from '../../components/cHeadder/Header.Component';
import { AllStackParams } from '../../navigation/Stack.Navigator';
import { Colors } from '../../global/theme/Colors.Theme';
import StylesTheme from '../../global/theme/Styles.Theme';
import { CheckIcon } from '../../global/icon/Icon';
import QuantityComponent from '../../components/cQuantity/Quantity.component';
import ItemCart from './ItemCart.cart';

interface IState {
    isCheckAll?: boolean;
}

const initialState: IState = {
    isCheckAll: false,
};

const Cart: React.FC = () => {
    const navigation = useNavigation<StackNavigationProp<AllStackParams>>();
    const [{ isCheckAll }, setState] = useState<IState>({ ...initialState });

    return (
        <View style={{ flex: 1, backgroundColor: '#edebeb' }}>
            <HeaderComponent
                titleHeader={'Giỏ hàng '}
                isOptionHome={false}
                goBack={() => navigation.goBack()}
            />
            <View style={[{flex: 1,}]}>
                <View style={{ padding: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Pressable
                        style={StylesTheme.onlyFlexDirectionAli_Center}
                        onPress={() => {
                            setState((prevState: any) => ({
                                ...prevState,
                                isCheckAll: !isCheckAll
                            }));
                        }}
                    >
                        <View
                            style={[styles.styleCheckbox, {
                                justifyContent: 'center', alignItems: 'center'
                            }, !isCheckAll ? { borderWidth: 1, borderColor: Colors.black } : { backgroundColor: Colors.primaryColor, }]}
                        >
                            {
                                isCheckAll && (
                                    <CheckIcon color={Colors.clWhite} size={16} />
                                )
                            }
                        </View>
                        <Text style={[StylesTheme.textLabel, { fontSize: 16 }]}>Chọn tất cả (1)</Text>
                    </Pressable>

                    <Pressable
                        onPress={() => {

                        }}
                    >
                        <Text style={[StylesTheme.textLabel, { fontSize: 16, color: 'red' }]}>Huỷ (1)</Text>
                    </Pressable>
                </View>

                <ItemCart />
                <ItemCart />
                <ItemCart />
            </View>
        </View >
    )
}

const styles = StyleSheet.create({
    styleCheckbox: {
        width: 24,
        height: 24,
        borderRadius: 24,
        marginRight: 6,
    },

    text: {
        fontSize: 18,
        fontWeight: '400',
    },
})

export default Cart;