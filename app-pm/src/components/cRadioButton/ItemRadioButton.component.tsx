
import React from 'react';
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
    SafeAreaView,
    Animated,
    StatusBar,
    Pressable,
    Modal,
} from 'react-native';

interface IProps {
    item?: any;
    isRefresh?: boolean;
    onComplete: (value: any) => void,
}

const ItemRadioButton: React.FC<IProps> = (props: IProps) => {
    const { item, onComplete } = props;

    return (
        <View>
            {item?.label ? (
                <TouchableOpacity
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        paddingVertical: 16,
                        borderBottomColor: '#ccc',
                        borderBottomWidth: 0.5,
                    }}
                    onPress={() => onComplete(item)}
                >
                    <Text style={{ fontSize: 18, fontWeight: '500' }} numberOfLines={2}>
                        {item?.label}
                    </Text>
                    <View
                        style={{
                            width: 26,
                            height: 26,
                            borderWidth: 1,
                            borderColor: '#000',
                            borderRadius: 22,
                            marginRight: 6,
                            padding: 3,
                        }}
                    >
                        <View
                            style={[
                                { flex: 1, borderRadius: 22, backgroundColor: '#fff' },
                                item?.isChecked === true && { backgroundColor: 'red' },
                            ]}
                        ></View>
                    </View>
                </TouchableOpacity>
            ) : null}
        </View>
    );
}

export default ItemRadioButton;
