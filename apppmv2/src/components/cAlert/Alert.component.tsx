import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    StyleSheet,
    View,
    Dimensions,
    TouchableOpacity,
    Modal,
    Text,
    Pressable,
    SafeAreaView,
    Image
} from 'react-native';

import StylesTheme from "../../global/theme/Styles.Theme";
import { CloseIcon, SuccessIcon } from "../../global/icon/Icon";
import { Colors } from "../../global/theme/Colors.Theme";
import { ENUM } from "../../global/enum";

type typeStatus = {
    show?: any;
    hide?: any;
};

const valueStatus: typeStatus = {

};

interface IState {
    isVisible: boolean,
    borderColor?: any,
    text: string,
    title?: string,
    status?: string,
}

const initialState: IState = {
    isVisible: false,
    borderColor: null,
    text: '',
    title: '',
    status: ''
};

let timeHide: number = 5000000;

export const AlertService = valueStatus;

const Alert: React.FC = () => {

    const [{ isVisible, borderColor, text, title, status }, setState] = useState<IState>({ ...initialState });

    const show = (_status: string, text: string, time: number, title?: string) => {
        timeHide = time;
        setState({
            isVisible: true,
            borderColor: _status === ENUM.E_SUCCESS ? "green" : "red",
            text: text,
            title: title,
            status: _status
        });
    };

    const autoHide = (timeHide: number) => {
        if (isVisible === true) {
            setTimeout(() => {
                hide();
            }, timeHide)
        }
    }

    const hide = () => {
        if (isVisible === true) {
            setState({ ...initialState });
        }
    };

    useEffect(() => {
        valueStatus.show = show;
        valueStatus.hide = hide;
    }, []);

    useEffect(() => {
        if (isVisible) {
            autoHide(timeHide);
        }
    }, [isVisible])

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={isVisible} //isVisible
        // onRequestClose={this.handleCloseModal}
        >
            <SafeAreaView style={[StylesTheme.droidSafeArea, { flex: 1, marginTop: 70 }]}>
                <Pressable
                    style={{
                        flex: 1,
                        justifyContent: 'flex-start',
                        alignItems: 'center',
                        paddingHorizontal: 24,
                    }}
                    onPress={() => {
                        setState({ ...initialState });
                    }}
                >
                    <View
                        style={[styles.wrapNotify, { borderColor: borderColor !== null && borderColor }]}
                    >
                        <View style={{ justifyContent: 'center', marginRight: 12 }}>
                        {
                            status === ENUM.E_SUCCESS ? (
                                <Image source={require("../../global/assets/image/done.png")} style={{ width: 40, height: 40 }} />
                            ) : (
                                <Image source={require("../../global/assets/image/error_server.png")} style={{ width: 40, height: 40 }} />
                            )
                        }
                        </View>
                        <View
                            style={[styles.btnClose, { borderColor: borderColor !== null && borderColor }]}
                        >
                            <CloseIcon color="#000" size={12} />
                        </View>
                        <View style={{ justifyContent: 'center', flex: 1, }}>
                            {
                                title && title?.length > 0 && (
                                    <Text style={[StylesTheme.textLabel, {fontSize: 16, color: borderColor}]}>{title}</Text>
                                )
                            }
                            {
                                text && text?.length > 0 && (
                                    <Text numberOfLines={3} style={[[StylesTheme.text14, {color: Colors.black}]]}>{text}</Text>
                                )
                            }
                        </View>
                    </View>
                </Pressable>
            </SafeAreaView>
        </Modal>
    )
};

const styles = StyleSheet.create({
    modal: {
        zIndex: 1,
        elevation: 1,
        position: 'absolute',
        height: "100%",
        width: "100%",
        // backgroundColor: "red"
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: "transparent"
    },

    wrapNotify: {
        width: '100%',
        padding: 6,
        paddingVertical: 8,
        flexDirection: 'row',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#000',
        backgroundColor: '#fff',
        // shadowOffset: { width: -2, height: 4 },
        // shadowColor: '#171717',
        // shadowOpacity: 0.2,
        // shadowRadius: 3,
    },

    btnClose: {
        position: 'absolute',
        top: -10,
        right: -10,
        padding: 6,
        borderRadius: 22,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#000',
    }
});

export default Alert;