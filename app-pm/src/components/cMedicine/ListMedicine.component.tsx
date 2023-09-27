import React, { useCallback, useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    Dimensions,
    FlatList,
    ScrollView,
    ActivityIndicator,
} from 'react-native';

import MedicineComponent from './Medicine.component';
import { Colors } from '../../global/theme/Colors.Theme';

const { width } = Dimensions.get('window');

interface IProps {
    data?: any;
    isHorizontal?: boolean;
    numColumn?: number;
    isNumColumn?: boolean;
    colorBtn?: any;
    api?: any;
}

interface IState {
    dataItem?: any | [];
    isLoading?: boolean;
}

const initialState: IState = {
    dataItem: null,
    isLoading: false,
};

const ListMedicine: React.FC<IProps> = (props: IProps) => {
    const { data, isHorizontal, numColumn, isNumColumn, colorBtn, api } = props;
    const [{ dataItem, isLoading }, setState] = useState<IState>({ ...initialState });

    const getData = useCallback(() => {
        fetch(api.urlApi, {
            method: 'GET',
            headers: { 'content-type': 'application/json' },
        })
            .then((res) => {
                if (res.ok) {
                    return res.json();
                }
            })
            .then((medicines) => {
                setState({
                    dataItem: medicines,
                    isLoading: false,
                });
            })
            .catch((error) => { });
    }, []);

    useEffect(() => {
        setState({
            isLoading: true
        })
        getData();
    }, []);

    return (
        <View style={{ width: width, maxWidth: width }}>
                {isLoading ? (
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <ActivityIndicator size="large" color={Colors.primaryColor} />
                    </View>
                ) : null}
                {isNumColumn && numColumn && numColumn > 0 ? (
                    <View
                        style={{
                            width: width,
                            maxWidth: width,
                            flexDirection: 'row',
                            flexWrap: 'wrap',
                            justifyContent: 'flex-start',
                        }}
                    >
                        {dataItem && Array.isArray(dataItem) && dataItem.length > 0
                            ? dataItem.map((item: any) => {
                                  return <MedicineComponent key={item.id} item={item} mgBottom={12} />;
                              })
                            : null}
                    </View>
                ) : (
                    <FlatList
                        data={dataItem}
                        horizontal={isHorizontal}
                        showsHorizontalScrollIndicator={false}
                        style={{ marginRight: 16 }}
                        renderItem={({ item }) => <MedicineComponent item={item} colorBtn={colorBtn} />}
                        keyExtractor={(item) => item.id}
                    />
                )}
            </View>
    )
};

export default ListMedicine;