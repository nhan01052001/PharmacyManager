import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';

import { MenuIcon, BellIcon } from '../../global/icon/Icon';

const SIZE = 40;
const COLOR = 'black';

const TitleHeader: React.FC = () => {
    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <View style={styles.wrapBtnMenu}>
                    <TouchableOpacity style={{}}>
                        <MenuIcon size={SIZE} color={COLOR} />
                    </TouchableOpacity>
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
