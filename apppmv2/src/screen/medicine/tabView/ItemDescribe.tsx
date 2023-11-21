import React from 'react';
import { View, Text } from 'react-native';

interface IProps {
    value?: any;
    label?: string;
    isRefresh?: boolean;
}

const ItemDescribe: React.FC<IProps> = (props: IProps) => {
    const { value, label } = props;

    return (
        <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 20, fontWeight: '700', marginBottom: 6 }}>{label ? label : null}</Text>
            <View style={{ paddingLeft: 14 }}>
                {value && value.split('.').length > 0
                    ? value.split('.').map((item: any, index: number) => {
                          return (
                              index + 1 !== value.split('.').length && (
                                  <Text
                                      key={index}
                                      style={{ fontSize: 16, fontWeight: '400', marginBottom: 4 }}
                                  >{`\u2022 ${item}`}</Text>
                              )
                          );
                      })
                    : null}
            </View>
        </View>
    );
}

export default React.memo(ItemDescribe, (prevProps, nextProps) => {
    return prevProps.isRefresh === nextProps.isRefresh;
});
