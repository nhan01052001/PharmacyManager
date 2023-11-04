import React, { useCallback, useEffect, useState } from 'react';
import {
    StyleSheet,
    View,
    Text,
    Image,
    FlatList,
    ActivityIndicator
} from 'react-native';
import { Province } from './Address.component';
import { District } from './Address.component';
import { Ward } from './Address.component';
import { Address } from './Address.component';
import StylesTheme from '../../global/theme/Styles.Theme';
import { Colors } from '../../global/theme/Colors.Theme';
import ItemAddressComponent from './Item.Address.component';
import Function from '../../global/assets/service/Function.Service';

interface IProps {
    dataSource: any,
    isFocusP: boolean,
    isFocusD: boolean,
    isFocusW: boolean,
    isEndList: boolean,
    onChooseProvince: (value?: Province) => void,
    onChooseDistrict: (value?: District) => void,
    onChooseWard: (value?: Ward) => void,
    onSetPagesForProvinces: () => void,
    // also contains all props of the TextInput component
}

let callOnEndReached: boolean = false,
    endLoading: boolean = false;

const ListItemAddress: React.FC<IProps> = (props: IProps) => {
    const { dataSource, isFocusP, isFocusD, isFocusW, isEndList, onChooseProvince, onChooseDistrict, onChooseWard, onSetPagesForProvinces } = props;

    const setPagesForProvinces = () => {
        console.log('callOnEndReached');
        
        callOnEndReached = false;
        onSetPagesForProvinces();
    }

    console.log('re-render');
    
    return (
        <View style={{ flex: 1, }}>
            {
                dataSource && Array.isArray(dataSource) && dataSource.length > 0 ? (
                    <FlatList
                        data={dataSource}
                        ListFooterComponent={() => {
                            return (
                                <View style={{ paddingVertical: 20 }}>
                                    {
                                        !isEndList && (
                                            <ActivityIndicator size={"large"} color={Colors.primaryColor} />
                                        )
                                    }
                                </View>
                            )
                        }}
                        renderItem={({ item, index }: { item: Address, index: number }) => {
                            return (
                                <ItemAddressComponent key={index} value={item} onChooseItem={(value?: Province | District | Ward) => {
                                    if (value) {
                                        if (isFocusP || (!isFocusD && !isFocusW)) {
                                            onChooseProvince(value);
                                        }
                                        else if (isFocusD) {
                                            onChooseDistrict(value);
                                        }
                                        else if (isFocusW) {
                                            onChooseWard(value);
                                        }
                                    }
                                }} />
                            )
                        }}
                        keyExtractor={(item: Address) => item.code}
                        onMomentumScrollEnd={() => {
                            // if (callOnEndReached && !endLoading) {
                            //     endLoading = true;
                            //     callOnEndReached = false;
                            // }
                        }}
                        onEndReached={() => {
                            if (!callOnEndReached && !isEndList) {
                                callOnEndReached = true;
                                setPagesForProvinces();
                            }
                        }} // refresh khi scroll den cuoi
                        onEndReachedThreshold={0}
                    />
                ) : (
                    <View style={StylesTheme.flexCenter}>
                        <Image source={require("../../global/assets/image/no-data.png")} style={{ width: 70, height: 70 }} />
                        <Text>Không tìm thấy dữ liệu phù hợp!</Text>
                    </View>
                )
            }
        </View>
    )
};

const styles = StyleSheet.create({
    wrapListItem: {
        flex: 1,
        backgroundColor: Colors.clWhite,
        marginTop: 12,
        paddingLeft: 12,
    }
});

export default React.memo(ListItemAddress, (prevProps, nextProps) => {
    return  prevProps.isFocusP !== nextProps.isFocusP
            || prevProps.isFocusD !== nextProps.isFocusD
            || prevProps.isFocusW !== nextProps.isFocusW
            || Function.compare(prevProps.dataSource, nextProps.dataSource) === false
    ? false : true;
});