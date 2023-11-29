import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Pressable } from 'react-native';
import { VerifyIcon } from '../../global/icon/Icon';
import Function from '../../service/Function.Service';

interface IProps {
    value?: any;
    isRefresh?: boolean;
    handleChoose: (value: any) => void,
}

const Item: React.FC<IProps> = (props: IProps) => {
    const { value, handleChoose } = props;

    return (
        <Pressable
            style={[
                { paddingHorizontal: 16, borderColor: '#000', borderWidth: 1, borderRadius: 12, marginRight: 12 },
                value?.isActive && { borderColor: '#5BC57E' },
            ]}
            onPress={() => handleChoose(value)}
        >
            {/* <View style={{ position: 'absolute', right: 0 }}>
                <VerifyIcon size={22} color="#5BC57E" />
            </View> */}
            <Text style={[styles.text, value?.isActive && { color: '#5BC57E' }]}>{value.name}</Text>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    text: {
        fontSize: 18,
        fontWeight: '600',
        marginVertical: 6,
    },
});



// export default React.memo(Item, (prevProps, nextProps) => {
//     if(typeof nextProps.value === 'object' || Array.isArray(nextProps.value)) {
//         return Function.compare(prevProps.value, nextProps.value);
//     } else {
//         return prevProps.value === nextProps.value;
//     }
// });

export default Item;