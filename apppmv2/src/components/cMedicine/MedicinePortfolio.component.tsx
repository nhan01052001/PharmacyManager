import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import { AllStackParams } from '../../navigation/Stack.Navigator';
import { env } from '../../utils/env.utils';

type Portfolio = {
    id: string,
    nameProductPortfolio: string,
    img_icon: string,
    api?: string,
    type?: string
};

interface IProps {
    data: Portfolio,
    isRefresh?: boolean,
}

const MedicinePortfolio: React.FC<IProps> = (props: IProps) => {
    const navigation = useNavigation<StackNavigationProp<AllStackParams>>();
    const { data, isRefresh } = props;


    return (
        <View style={styles.container}>
            <View style={styles.wrapContent}>
                <TouchableOpacity
                onPress={() => {
                    navigation.navigate('AllMedicine', {
                        api: {
                            urlApi: `${env.URL}/medicine/findMedicine`,
                            configHeader: {
                                'page': 1,
                                'pageSize': 20,
                            },
                            dataBody: {
                                "type": {
                                    "value": data?.type ? data?.type : ''
                                }
                            },
                        }
                    });
                }
                }
                    style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: 80,
                        maxHeight: 80,
                        width: 80,
                        maxWidth: 80,
                    }}
                >
                    <View style={[]}>
                        <Image source={{ uri: data.img_icon }} style={{ width: 36, height: 36 }} />
                    </View>
                    <View style={{ marginTop: 6 }}>
                        <Text style={styles.text}>{data?.nameProductPortfolio}</Text>
                    </View>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: '33.333%',
        height: 90,
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 8,
    },

    text: {
        textAlign: 'center',
        fontWeight: '600',
        fontSize: 14,
    },

    wrapContent: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default React.memo(MedicinePortfolio, (prevProps, nextProps) => {
    return prevProps.isRefresh === nextProps.isRefresh;
});