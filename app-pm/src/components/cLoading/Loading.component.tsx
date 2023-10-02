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

type typeStatus = {
    show?: any;
    hide?: any;
};

const valueStatus: typeStatus = {
    
}

export const LoadingService = valueStatus;

const Loading: React.FC = () => {

    const [isVisible, setIsVisible] = useState<boolean>(false);

    const show = () => {
        console.log("show");
        setIsVisible(true,);
    };

    const hide = () => {
        console.log("hide");
        setIsVisible(false);
    };

    useEffect(() => {
        console.log("useEffect");
        valueStatus.show = show;
        valueStatus.hide = hide;
    }, []);

    LoadingService.show
    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={isVisible}
        >
            <View style={styles.modal}>
                <View style={styles.container}>
                    <ActivityIndicator size="large" color="#00ff00" />
                </View>
            </View>
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
});

export default Loading;