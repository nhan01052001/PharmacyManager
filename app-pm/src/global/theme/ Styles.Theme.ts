import { StyleSheet, Platform, Dimensions, PixelRatio } from 'react-native';

const { width, height } = Dimensions.get('window');

// based on iphone 5s's scale
const scale = width / 320;

function normalize(size: number) {
    const newSize = size * scale;
    if (Platform.OS === 'ios') {
        return Math.round(PixelRatio.roundToNearestPixel(newSize));
    } else {
        return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2;
    }
}

export default StyleSheet.create({
    sizeText: {
        fontSize: width > 420 ? 16 : 14,
    },

    sizeTextMini: {
        fontSize: normalize(12),
    },

    sizeTextSmall: {
        fontSize: normalize(15),
    },

    sizeTextMedium: {
        fontSize: normalize(17),
    },

    sizeTextLarge: {
        fontSize: normalize(20),
    },

    sizeTextSuperLarge: {
        fontSize: normalize(24),
    },

    droidSafeArea: {
        paddingVertical: Platform.OS === 'android' ? 12 : 0,
    },
});
