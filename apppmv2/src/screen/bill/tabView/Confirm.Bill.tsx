import React, { createRef, useEffect } from 'react';
import {
    StyleSheet,
    View,
    Text,
    Image,
    TouchableOpacity
} from 'react-native';
import { useNavigation } from '@react-navigation/core';
import { StackNavigationProp } from '@react-navigation/stack';

import StylesTheme from '../../../global/theme/Styles.Theme';
import { Colors } from '../../../global/theme/Colors.Theme';
import { AllStackParams } from '../../../navigation/Stack.Navigator';

const Confirm: React.FC = () => {
    const navigation = useNavigation<StackNavigationProp<AllStackParams>>();

    useEffect(() => {
        console.log("0ke");

    }, [])

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Image source={require('../../../global/assets/image/no-data.png')} style={{ width: 100, height: 100, }}
            />
            <Text style={[StylesTheme.text16]}>Bạn chưa có đơn hàng nào!</Text>
            <TouchableOpacity
                onPress={() => {
                    navigation.navigate('BottomTabNavigator');
                }}
                style={{ backgroundColor: '#f7f7f7', borderWidth: 1, borderColor: Colors.primaryColor, borderRadius: 8, width: '30%', paddingVertical: 10, alignItems: 'center', marginTop: 12 }}
            >
                <Text style={[StylesTheme.textLabel, { color: Colors.primaryColor }]}>Mua sắm</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },

    item: {
        flex: 1,
        marginVertical: 12,
    },
});

export default Confirm;
