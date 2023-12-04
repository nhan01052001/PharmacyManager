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

import { AllStackParams } from '../../../navigation/Stack.Navigator';
import { Colors } from '../../../global/theme/Colors.Theme';
import StylesTheme from '../../../global/theme/Styles.Theme';
import { CheckIcon, OclockIcon } from '../../../global/icon/Icon';

interface IProps {
    dataItem?: any;
}

interface IState {
    isCheckAll?: boolean;
}

const initialState: IState = {
    isCheckAll: false,
};

export const ItemBillWaiting: React.FC<IProps> = (props: IProps) => {
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
                                    <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center' }}>
                                        <View>
                                            <Text style={{ fontSize: 18, color: '#000' }}>x {dataItem?.quantityPurchase}</Text>
                                        </View>
                                    </View>
                                </View>
                                <View style={{ flexDirection: 'row', alignItems: 'center', width: '90%', maxWidth: '90%', marginTop: 6, }}>
                                    <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center' }}>
                                        <Text style={[StylesTheme.text16]}>Thành tiền:

                                        </Text>
                                        <Text style={[styles.text, { color: '#e33232', fontSize: 18, marginLeft: 6 }]}>
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
                        <View style={{ width: '100%', paddingVertical: 8, }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <OclockIcon size={26} color='#000' />
                                <Text numberOfLines={1} style={[StylesTheme.text16, { color: Colors.primaryColor, marginLeft: 6, maxWidth: '95%' }]}>Đơn hàng của bạn đang được xem xét!</Text>
                            </View>
                        </View>
                        <View style={{width: '100%', alignItems: 'flex-start'}}>
                            <TouchableOpacity style={{padding: 8, backgroundColor: '#fa9450', borderRadius: 8}}
                                onPress={() => {
                                    navigation.navigate("DetailMedicine", {
                                        item: { ...dataItem }
                                    });
                                }}
                            >
                                <Text numberOfLines={1} style={[StylesTheme.text16, { color: '#000' }]}>Mua lại sản phẩm</Text>
                            </TouchableOpacity>
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

export default ItemBillWaiting;