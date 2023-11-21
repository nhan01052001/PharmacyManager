import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';

import StylesTheme from '../../global/theme/Styles.Theme';

const DrugStore: React.FC = () => {
    return (
        <View style={styles.container}>
        <View style={styles.wrapContent}>
            <TouchableOpacity style={{ alignItems: 'center' }}>
                <View style={[styles.bgIcon, { backgroundColor: '#41BB2D' }]}>
                    <Image source={require('../../global/assets/image/phone-call.png')} style={styles.widthIcon} />
                </View>
                <View style={{ marginTop: 6 }}>
                    <Text style={[styles.text ,StylesTheme.sizeText]}>Liên hệ cho {'\n'} nhà thuốc</Text>
                </View>
            </TouchableOpacity>

            <TouchableOpacity style={{ alignItems: 'center' }}>
                <View style={[styles.bgIcon, { backgroundColor: '#F2DD1E' }]}>
                    <Image source={require('../../global/assets/image/address.png')} style={styles.widthIcon} />
                </View>
                <View style={{ marginTop: 6 }}>
                    <Text style={[styles.text ,StylesTheme.sizeText]}>Vị trí {'\n'} nhà thuốc</Text>
                </View>
            </TouchableOpacity>

            <TouchableOpacity style={{ alignItems: 'center' }}>
                <View style={[styles.bgIcon, { backgroundColor: '#C25151' }]}>
                    <Image source={require('../../global/assets/image/information.png')} style={styles.widthIcon} />
                </View>
                <View style={{ marginTop: 6 }}>
                    <Text style={[styles.text ,StylesTheme.sizeText]}>Thông tin {'\n'} nhà thuốc</Text>
                </View>
            </TouchableOpacity>
        </View>
    </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingVertical: 22,
        backgroundColor: '#fff',
        width: '80%',
        borderRadius: 12,
        shadowOffset: { width: -2, height: 4 },
        shadowColor: '#171717',
        shadowOpacity: 0.2,
        shadowRadius: 3,
    },

    wrapContent: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
    },

    bgIcon: {
        width: 60,
        paddingVertical: 12,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },

    text: {
        textAlign: 'center',
        fontWeight: '600',
        fontSize: 14,
    },

    widthIcon: {
        width: 36,
        height: 36,
    },
});

export default DrugStore;