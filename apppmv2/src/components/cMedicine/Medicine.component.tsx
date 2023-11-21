import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions, FlatList, ScrollView } from 'react-native';

import { Product } from '../../type/Product.type';
import Function from '../../service/Function.Service';
import StylesTheme from '../../global/theme/Styles.Theme';
import { useNavigation } from '@react-navigation/native';
import { MainStackParams, RootStackParams } from '../../navigation/Stack.Navigator';
import { StackNavigationProp } from '@react-navigation/stack';

const { width } = Dimensions.get('window');

const widthDefault = width > 400 ? (width * 45) / 100 : (width * 44) / 100;
const fontSizeDefault = width > 400 ? 16 : 13;

interface IProps {
    item?: Product;
    colorBtn?: any;
    mgBottom?: any;
    handleClickProduct?: any;
}

const Medicine: React.FC<IProps> = (props: IProps) => {
    const navigation = useNavigation<StackNavigationProp<RootStackParams>>();
    const { item, colorBtn, mgBottom, handleClickProduct } = props;

    return (
        <TouchableOpacity
            style={[styles.container, mgBottom && { marginBottom: mgBottom }]}
            onPress={() => {
                navigation.navigate("DetailMedicine", {
                    item: {...item}
                });
            }}
        >
            <View style={{ flex: 1, padding: 12, justifyContent: 'flex-start', alignItems: 'center' }}>
                <View style={{ width: '100%', height: '40%' }}>
                    <Image
                        source={{ uri: item?.imgProduct }}
                        resizeMode={'contain'}
                        style={{ width: '100%', height: '100%' }}
                    />
                </View>
                <View style={{ width: '100%', height: '60%', marginTop: 12, justifyContent: 'space-between' }}>
                    <View>
                        <Text numberOfLines={2}>{item?.name}</Text>
                    </View>

                    <View style={{ width: '100%' }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Text style={[StylesTheme.sizeText, { color: 'red', fontWeight: '700' }]}>
                                {item?.priceCourse} đ
                            </Text>
                            {item?.isPromotion === true ? (
                                <Text
                                    style={[
                                        StylesTheme.sizeText,
                                        { color: '#ccc', textDecorationLine: 'line-through' },
                                    ]}
                                >
                                    555.000 đ
                                </Text>
                            ) : null}
                        </View>
                        <View style={{ flexDirection: 'row' }}>
                            <Text>Đơn vị tính: </Text>
                            <Text style={{ fontWeight: '600' }} numberOfLines={2}>
                                {item?.unit?.box === true ? 'Hộp' : null}, {item?.unit?.pill === true ? 'Viên' : null},
                            </Text>
                        </View>
                    </View>

                    <View style={{ width: '100%', alignItems: 'center', marginBottom: 12 }}>
                        <TouchableOpacity
                            style={{
                                backgroundColor: '#41BB2D',
                                padding: 4,
                                borderRadius: 12,
                                width: '100%',
                                alignItems: 'center',
                            }}
                            onPress={() => { }}
                        >
                            <Text>Thêm vào giỏ hàng</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    )
};

const styles = StyleSheet.create({
    container: {
        width: widthDefault,
        height: 230,
        backgroundColor: '#fff',
        marginRight: 12,
        borderColor: '#D2D2D2',
        borderWidth: 1,
        borderRadius: 12,
    },
});


export default React.memo(Medicine, (prevProps, nextProps) => {
    return Function.compare(prevProps.item, nextProps.item);
});