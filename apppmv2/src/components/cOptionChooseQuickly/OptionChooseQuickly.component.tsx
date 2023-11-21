import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';

import ItemComponent from './Item.component';
import Function from '../../service/Function.Service';

interface IProps {
    data?: any[];
    isRefresh?: boolean;
    onComplete: (value: any) => void,
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

const OptionChooseQuickly: React.FC<IProps> = (props: IProps) => {
    const { data, onComplete } = props;
    const [{ dataLocal, isLoading, itemSelected }, setState] = useState<IState>({ ...initialState });

    const getData = () => {

        setState((prevState) => ({
            ...prevState,
            dataLocal: data ? [...data] : [],
            isLoading: false,
        }));
    };

    useEffect(() => {
        getData();
    }, []);

    const handleChoose = (item: any) => {

        if (dataLocal !== null) {
            let index2 = dataLocal.findIndex((obj) => obj.id === item.id);
            if (dataLocal[index2].isActive === false) {
                let index1 = dataLocal.findIndex((obj) => obj.isActive === true);
                dataLocal[index1].isActive = false;

                dataLocal[index2].isActive = true;

                setState((prevState) => ({
                    ...prevState,
                    dataLocal: dataLocal,
                    itemSelected: item,
                }));
            }
        }
    };

    useEffect(() => {
        onComplete(onComplete);
    }, [itemSelected])

    return (
        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
            <ScrollView horizontal={true} scrollEnabled={false}>
                {dataLocal !== null
                    ? dataLocal.map((item: any) => {
                        return (
                            <ItemComponent
                                key={item?.id}
                                value={item}
                                handleChoose={(value: any) => handleChoose(value)}
                            />
                        );
                    })
                    : null}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    text: {
        fontSize: 18,
        fontWeight: '600',
        marginVertical: 6,
    },
});

export default React.memo(OptionChooseQuickly, (prevProps, nextProps) => {
    if (prevProps.isRefresh === nextProps.isRefresh) {
        return true;
    } else if (Array.isArray(nextProps.data)) {
        return Function.compare(prevProps.data, nextProps.data);
    } else {
        return false;
    }
});
