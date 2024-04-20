import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import { MenuIcon, BellIcon, CartIcon } from '../../global/icon/Icon';
import { AllStackParams } from '../../navigation/Stack.Navigator';
import { useAppSelector } from '../../redux/reduxHook.redux';
import { CartStore } from '../../redux/cart-slice.redux';

const SIZE = 40;
const COLOR = 'black';

const TitleHeader: React.FC = () => {
    const navigation = useNavigation<StackNavigationProp<AllStackParams>>();
    const data = useAppSelector(CartStore);

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <View style={styles.wrapBtnMenu}>
                    <TouchableOpacity
                        onPress={() => {
                            navigation.navigate('Cart')
                        }}
                    >
                        <CartIcon color='#000' size={36} />
                    </TouchableOpacity>
                    <View
                        style={{
                            backgroundColor: 'red',
                            position: 'absolute',
                            borderRadius: 22,
                            width: 22,
                            height: 22,
                            justifyContent: 'center',
                            alignItems: 'center',
                            right: -10,
                            top: -10,
                        }}
                    >
                        <Text
                            style={{ fontSize: 16, fontWeight: '700' }}
                        >
                            {data.dataCount?.countCart ? data.dataCount?.countCart : 0}
                        </Text>
                    </View>
                </View>

                <View>
                    <Image
                        source={require('../../global/assets/image/logo.png')}
                        style={{ width: 130, height: 62 }}
                        resizeMode="center"
                    />
                </View>

                <View style={styles.wrapBtnNotify}>
                    <TouchableOpacity style={{}}>
                        <BellIcon size={36} color={COLOR} />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 8,
    },

    content: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'flex-start',
    },

    wrapBtnMenu: {
        position: 'absolute',
        left: 12,
        top: 12,
    },

    wrapBtnNotify: {
        position: 'absolute',
        right: 12,
        top: 8,
    },
});

export default TitleHeader;
