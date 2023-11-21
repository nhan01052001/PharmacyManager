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
import { Product } from '../../type/Product.type';
import HttpService from '../../service/HttpService.Service';

const { width } = Dimensions.get('window');

interface IProps {
    data?: Product[];
    isHorizontal?: boolean;
    numColumn?: number;
    isNumColumn?: boolean;
    colorBtn?: any;
    api?: any;
    isRefresh?: boolean;
}

interface IState {
    dataLocal?: Product[];
    isLoading?: boolean;
}

const initialState: IState = {
    dataLocal: [],
    isLoading: true,
};

const ListMedicine: React.FC<IProps> = (props: IProps) => {
    const { data, isHorizontal, numColumn, isNumColumn, colorBtn, api } = props;
    const [{ dataLocal, isLoading }, setState] = useState<IState>({ ...initialState });

    const getData = () => {

        HttpService.Get(api?.urlApi)
            .then((res) => {                
                if (res && Array.isArray(res)) {
                    setState((prevState) => ({
                        ...prevState,
                        dataLocal: [...res],
                        isLoading: false,
                    }));
                }
            }).catch((error) => {

            })
    }

    useEffect(() => {
        if ((!data || data.length === 0) && api && api?.urlApi) {
            getData();
        } else {
            setState({
                dataLocal: data,
                isLoading: false,
            });
        }
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
                    {dataLocal && Array.isArray(dataLocal) && dataLocal.length > 0
                        ? dataLocal.map((item: any) => {
                            return <MedicineComponent key={item.id} item={item} mgBottom={12} />;
                        })
                        : null}
                </View>
            ) : (
                <FlatList
                    data={dataLocal}
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

export default React.memo(ListMedicine, (prevProps, nextProps) => {
    return prevProps.isRefresh === nextProps.isRefresh;
});