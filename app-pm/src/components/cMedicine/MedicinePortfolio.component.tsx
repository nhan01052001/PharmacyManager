import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions, FlatList } from 'react-native';
import Function from '../../service/Function.Service';

type Portfolio = {
    id: string,
    nameProductPortfolio: string,
    img_icon: string,
    api?: string,
};

interface IProps {
    data: Portfolio,
    isRefresh?: boolean,
}

const MedicinePortfolio: React.FC<IProps> = (props: IProps) => {
    const { data, isRefresh } = props;


    return (
        <View style={styles.container}>
            <View style={styles.wrapContent}>
                <TouchableOpacity
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