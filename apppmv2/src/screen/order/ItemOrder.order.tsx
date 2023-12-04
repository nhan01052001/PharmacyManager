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
import OptionChooseQuickly from '../../components/cOptionChooseQuickly/OptionChooseQuickly.component';

interface IProps {
    dataItem?: any;
}

interface IState {
    isCheckAll?: boolean;
}

const initialState: IState = {
    isCheckAll: false,
};

export const ItemOrder: React.FC<IProps> = (props: IProps) => {
    const navigation = useNavigation<StackNavigationProp<AllStackParams>>();
    const { dataItem } = props;
    const [{ isCheckAll }, setState] = useState<IState>({ ...initialState });


    return (
        <View style={{}}>
            <View style={{ width: '100%', borderBottomWidth: 3, borderBottomColor: '#edebeb', paddingVertical: 12, backgroundColor: Colors.clWhite }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', paddingRight: 12 }}>
                    <View style={{ width: '90%', maxWidth: '90%', paddingHorizontal: 12 }}>
                        <View style={{ flexDirection: 'row' }}>
                            <Image
                                source={{ uri: dataItem?.lsImage?.split(',')[0] }}
                                style={{ width: 65, height: 65, borderRadius: 8, borderColor: Colors.colorGrey, borderWidth: 1, }}
                                resizeMode='contain'
                            />
                            <View style={{ marginLeft: 8, width: '100%', justifyContent: 'flex-start' }}>
                                <Text numberOfLines={2} style={[StylesTheme.text16, { maxWidth: '90%', }]}>{dataItem?.fullName}</Text>
                                <View style={{ flexDirection: 'row', alignItems: 'flex-end', paddingVertical: 3 }}>
                                    <Text style={[styles.text, { color: Colors.colorGray_2, fontSize: 17, marginRight: 6 }]}>
                                        {
                                            new Intl.NumberFormat('en-US', {
                                                currency: 'VND',
                                                style: 'currency',
                                            }).format(dataItem?.price !== null ? Number(dataItem?.price) : 0).replace('₫', '')
                                        }₫/{dataItem?.unitPurchaseView[0]?.name}
                                    </Text>
                                </View>
                                <View style={{ flexDirection: 'row', alignItems: 'center', width: '90%', maxWidth: '90%' }}>
                                    <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <View>
                                            <Text style={{fontSize: 18, color: '#000'}}>x {dataItem?.quantityPurchase}</Text>
                                        </View>

                                        <View>
                                            <Text style={[styles.text, { color: '#e33232', fontSize: 18, marginRight: 6 }]}>
                                                {
                                                    new Intl.NumberFormat('en-US', {
                                                        currency: 'VND',
                                                        style: 'currency',
                                                    }).format(dataItem?.pricePurchase !== null ? Number(dataItem?.pricePurchase) : 0).replace('₫', '')
                                                }₫
                                            </Text>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </View>
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

export default ItemOrder;