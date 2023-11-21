import React, { useEffect, useState } from 'react';
import { View, FlatList, Text, TouchableOpacity } from 'react-native';

import ItemRadioButton from './ItemRadioButton.component';
import Function from '../../service/Function.Service';

interface IProps {
    data?: any;
    value?: any;
    isRefresh?: boolean;
    onComplete: (value: any) => void,
    onClose: (value?: any) => void,
}

interface IState {
    dataLocal: any[];
    isLoading?: boolean;
    itemSelected?: any;
}

const initialState: IState = {
    dataLocal: [],
    isLoading: true,
    itemSelected: null,
};

const RadioButton: React.FC<IProps> = (props: IProps) => {
    const { data, onComplete, onClose, value } = props;
    const [{ dataLocal, isLoading, itemSelected }, setState] = useState<IState>({ ...initialState });

    const getData = () => {

        setState((prevState) => ({
            ...prevState,
            dataLocal: [...data],
            isLoading: false,
        }));
    };

    useEffect(() => {
        getData();
    }, []);

    const handleSetChecked = (item: any) => {
        debugger;

        if (dataLocal) {
            let index2 = dataLocal.findIndex((obj) => obj.id === item.id);
            if (dataLocal[index2].isChecked === false) {
                let index1 = dataLocal.findIndex((obj) => obj.isChecked === true);
                dataLocal[index1].isChecked = false;

                dataLocal[index2].isChecked = true;

                setState((prevState) => ({
                    ...prevState,
                    dataLocal: dataLocal,
                    itemSelected: item,
                }));
            }
        }
    };

    return (
        <View style={[{ flex: 1 }, dataLocal === null && { justifyContent: 'center', alignItems: 'center' }]}>
            {dataLocal === null ? (
                <Text style={{ fontSize: 18, fontWeight: '700' }}>Chưa có dữ liệu. Vui lòng thử lại!</Text>
            ) : (
                <View style={{ flex: 1 }}>
                    <FlatList
                        data={dataLocal}
                        renderItem={({ item }) => (
                            <ItemRadioButton
                                item={item}
                                onComplete={(item) => {
                                    handleSetChecked(item);
                                }}
                            />
                        )}
                        keyExtractor={(item) => item.id}
                    />
                    {/* btn */}
                    <View
                        style={{
                            flex: 0.5,
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        <TouchableOpacity
                            style={{
                                width: '100%',
                                padding: 12,
                                justifyContent: 'center',
                                alignItems: 'center',
                                backgroundColor: '#5BC57E',
                                borderRadius: 8,
                            }}
                            onPress={() => {
                                onComplete(itemSelected);
                                onClose();
                            }}
                        >
                            <Text style={{ fontSize: 18, fontWeight: '600' }}>Xác nhận</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}
        </View>
    );
}

export default React.memo(RadioButton, (prevProps, nextProps) => {
    if (prevProps.isRefresh === nextProps.isRefresh) {
        return true;
    } else if (Array.isArray(nextProps.data)) {
        return Function.compare(prevProps.data, nextProps.data);
    } else {
        return false;
    }
});
