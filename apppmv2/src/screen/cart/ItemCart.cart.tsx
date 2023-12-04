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
    onCheckItem: (cartId: string) => void,
    onChangeQuantity: (cartId: string, value: number, medicineId: string) => void,
}

interface IState {
    isCheckAll?: boolean;
}

const initialState: IState = {
    isCheckAll: false,
};

export const ItemCart: React.FC<IProps> = (props: IProps) => {
    const navigation = useNavigation<StackNavigationProp<AllStackParams>>();
    const { dataItem, onCheckItem, onChangeQuantity } = props;
    const [{ isCheckAll }, setState] = useState<IState>({ ...initialState });
    

    return (
        <View style={{}}>
            <View style={{ width: '100%', borderBottomWidth: 3, borderBottomColor: '#edebeb', paddingVertical: 12, backgroundColor: Colors.clWhite }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', paddingRight: 12 }}>
                    <TouchableOpacity
                        style={{
                            width: '10%', justifyContent: 'center', alignItems: 'center',
                            paddingLeft: 18,
                        }}
                        onPress={() => {
                            if(dataItem?.cartId && typeof dataItem?.cartId == 'string')
                                onCheckItem(dataItem?.cartId);
                        }}
                    >
                        <View
                            style={[styles.styleCheckbox, {
                                justifyContent: 'center', alignItems: 'center'
                            }, !dataItem?.isChecked ? { borderWidth: 1, borderColor: Colors.black } : { backgroundColor: Colors.primaryColor, }]}
                        >
                            {
                                dataItem?.isChecked && (
                                    <CheckIcon color={Colors.clWhite} size={16} />
                                )
                            }
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity style={{ width: '90%', maxWidth: '90%', paddingHorizontal: 12 }}>
                        <View style={{ flexDirection: 'row' }}>
                            <Image
                                source={{ uri: dataItem?.lsImage?.split(',')[0] }}
                                style={{ width: 65, height: 65, borderRadius: 8, borderColor: Colors.colorGrey, borderWidth: 1, }}
                                resizeMode='contain'
                            />
                            <View style={{ marginLeft: 8, width: '100%', justifyContent: 'flex-start' }}>
                                <Text numberOfLines={2} style={[StylesTheme.text16, { maxWidth: '90%', }]}>{dataItem?.fullName}</Text>
                                <View style={{ flexDirection: 'row', alignItems: 'flex-end', paddingVertical: 3 }}>
                                    <Text style={[styles.text, { color: '#e33232', fontSize: 17, marginRight: 6 }]}>
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
                    </TouchableOpacity>
                </View>
                <View style={{ paddingVertical: 6, alignItems: 'flex-end', paddingRight: 12 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', width: '90%', maxWidth: '90%' }}>
                        <View style={{ width: 89 }} />

                        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                            <View>
                                <OptionChooseQuickly
                                    data={Array.isArray(dataItem?.unitPurchaseView) ? dataItem?.unitPurchaseView : []}
                                    onComplete={(item) => null}
                                />
                            </View>

                            <QuantityComponent
                                value={isNaN(Number(dataItem?.quantityPurchase)) ? 1 : Number(dataItem?.quantityPurchase)}
                                limit={100}
                                onComplete={(value: number) => {
                                    console.log(value, 'value');
                                    onChangeQuantity(dataItem?.cartId, value, dataItem?.medicineId);
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