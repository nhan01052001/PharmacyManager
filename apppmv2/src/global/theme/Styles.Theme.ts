import { Circle } from 'react-native-svg';
import { StyleSheet, Platform, Dimensions, PixelRatio } from 'react-native';
import { Colors } from './Colors.Theme';

export const { width, height } = Dimensions.get('window');

// based on iphone 5s's scale
const scale = width / 320;
const PLATFORM_IOS = Platform.OS === 'ios' ? true : false;

function normalize(size: number) {
    const newSize = size * scale;
    if (PLATFORM_IOS) {
        return Math.round(PixelRatio.roundToNearestPixel(newSize));
    } else {
        return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2;
    }
}

const MINI = normalize(12);
const SMALL = normalize(14);
const MEDIUM = normalize(17);
const LARGE = normalize(20);
const SUPERLARGER = normalize(24);

export default StyleSheet.create({

    sizeLogo: {
        width: 200, height: 132
    },

    sizeText: {
        fontSize: width > 420 ? 16 : 14,
    },

    sizeTextMini: {
        fontSize: MINI,
    },

    sizeTextSmall: {
        fontSize: SMALL,
    },

    sizeTextMedium: {
        fontSize: MEDIUM,
    },

    sizeTextLarge: {
        fontSize: LARGE,
    },

    sizeTextSuperLarge: {
        fontSize: SUPERLARGER,
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

    circle18: {
        width: 18,
        height: 18,
        borderRadius: 18,
    },

    circle22: {
        width: 22,
        height: 22,
        borderRadius: 22,
    },

    circle32: {
        width: 32,
        height: 32,
        borderRadius: 32,
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
        backgroundColor: Colors.primaryColor,
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
    },

    textBasic: {
        fontSize: 13, fontWeight: '400', color: '#000'
    },

    text14: {
        fontSize: MINI, fontWeight: PLATFORM_IOS ? '400' : '500', color: '#000'
    },

    text16: {
        fontSize: SMALL, fontWeight: PLATFORM_IOS ? '400' : '500', color: '#000'
    },

    textLabel: {
        fontSize: MEDIUM, fontWeight: PLATFORM_IOS ? '500' : '700', color: '#000'
    },

});
