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

const COLOR = {
    primaryColor: "#5BC57E",

}

export default StyleSheet.create({

    sizeLogo: {
        width: 200, height: 132
    },

    sizeText: {
        fontSize: width > 420 ? 16 : 14,
    },

    sizeTextMini: {
        fontSize: normalize(12),
    },

    sizeTextSmall: {
        fontSize: normalize(14),
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

    onlyFlexDirectionAli_Center: {
        flexDirection: 'row', alignItems: 'center'
    },

    onlyFlexRow_AliCenter_JusSP: {
        flexDirection: "row", alignItems: "center", justifyContent: "space-between"
    },

    wh18: {
        width: 18,
        height: 18
    },

    wh22: {
        width: 22,
        height: 22
    },

    wh32: {
        width: 32,
        height: 32
    },

    flexW100: {
        flex: 1, width: '100%'
    },

    marginV12: {
        marginVertical: 12
    },

    marginV24: {
        marginVertical: 12
    },

    paddingH24: {
        paddingHorizontal: 24
    },

    btnPrimary: {
        flex: 1,
        backgroundColor: COLOR.primaryColor,
        paddingVertical: 14,
        borderRadius: 20,
        alignItems: 'center',
    },

    textError: {
        fontSize: 16, fontWeight: "600", color: "red", textAlign: "center"
    },

    flexRowCenter: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },

    line30: {
        width: '30%', height: 1, backgroundColor: '#ccc'
    },

    flexCenter: {
        flex: 1, alignItems: 'center', justifyContent: 'center'
    },

    styleTextBtnBasic: {
        fontSize: 18, fontWeight: '600', fontStyle: 'italic'
    }

});

export { COLOR as Colors }
