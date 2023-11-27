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

import { AllStackParams } from '../../navigation/Stack.Navigator';
import { Colors } from '../../global/theme/Colors.Theme';
import StylesTheme from '../../global/theme/Styles.Theme';
import { CheckIcon } from '../../global/icon/Icon';
import QuantityComponent from '../../components/cQuantity/Quantity.component';

interface IProps {

}

interface IState {
    isCheckAll?: boolean;
}

const initialState: IState = {
    isCheckAll: false,
};

export const ItemCart: React.FC<IProps> = (props: IProps) => {
    const navigation = useNavigation<StackNavigationProp<AllStackParams>>();
    const [{ isCheckAll }, setState] = useState<IState>({ ...initialState });

    return (
        <View style={{  }}>
            <View style={{ width: '100%', borderBottomWidth: 3, borderBottomColor: '#edebeb', paddingVertical: 12, backgroundColor: Colors.clWhite }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', paddingRight: 12 }}>
                    <TouchableOpacity
                        style={{
                            width: '10%', justifyContent: 'center', alignItems: 'center',
                            paddingLeft: 12,
                        }}
                        onPress={() => {
                            // setState((prevState: any) => ({
                            //     ...prevState,
                            //     isCheckAll: !isCheckAll
                            // }));
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
                    </TouchableOpacity>

                    <TouchableOpacity style={{ width: '90%', maxWidth: '90%', paddingHorizontal: 12 }}>
                        <View style={{ flexDirection: 'row' }}>
                            <Image
                                source={{ uri: 'https://firebasestorage.googleapis.com/v0/b/pharmacy-manager-401ca.appspot.com/o/Medicine%2FEnterogen_1.jpeg?alt=media&token=2358b5e3-fdd3-4851-b02d-255de61cadd7' }}
                                style={{ width: 65, height: 65, borderRadius: 8, borderColor: Colors.colorGrey, borderWidth: 1, }}
                                resizeMode='contain'
                            />
                            <View style={{ marginLeft: 8, }}>
                                <Text numberOfLines={2} style={[StylesTheme.text16, { maxWidth: '90%', }]}>Thực phẩm bảo vệ sức khỏe viên sủi bổ sung vitamin và khoáng chất Berocca Performance hương xoài (Tuýp 10 viên)</Text>
                                <View style={{ flexDirection: 'row', alignItems: 'flex-end', paddingVertical: 3 }}>
                                    <Text style={[styles.text, { color: '#5BC57E', fontSize: 17, marginRight: 6 }]}>
                                        199.000đ
                                    </Text>
                                    <Text
                                        style={[
                                            styles.text,
                                            { color: '#ccc', fontSize: 15, textDecorationLine: 'line-through' },
                                        ]}
                                    >
                                        299.000đ
                                    </Text>
                                </View>
                            </View>
                        </View>
                    </TouchableOpacity>
                </View>
                <View style={{ paddingVertical: 6, alignItems: 'flex-end', paddingRight: 12 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', width: '90%', maxWidth: '90%' }}>
                        <View style={{ width: 89 }} />

                        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                            <View>
                                <Text>123</Text>
                            </View>

                            <QuantityComponent
                                value={1}
                                limit={100}
                                onComplete={(value: number) => {
                                    // handleQuantityPurchase(value);
                                }}
                            />
                        </View></View>

                </View>
            </View>
        </View>
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

export default ItemCart;