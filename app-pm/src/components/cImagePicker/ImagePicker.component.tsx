import React, { useState, useEffect } from 'react';
import {
    SafeAreaView,
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Image,
    Platform,
    PermissionsAndroid,
    Modal,
    Pressable
} from 'react-native';
import {
    launchCamera,
    launchImageLibrary,
    CameraOptions,
    Asset,
} from 'react-native-image-picker';
import { AlertService } from '../cAlert/Alert.component';
import { ENUM } from '../../global/enum';
import { Colors } from '../../global/theme/Colors.Theme';
import StylesTheme from '../../global/theme/Styles.Theme';
import * as Progress from 'react-native-progress';

interface IState {
    filePath?: Asset,
    isShowModal?: boolean,
}

const initialState: IState = {
    filePath: undefined,
    isShowModal: false,
}

interface IProps {
    label?: string,
    onComplete: (value: string) => void,
}


const ImagePicker: React.FC<IProps> = (props: IProps) => {
    const { label, onComplete } = props;
    const [{ filePath, isShowModal }, setState] = useState<IState>({ ...initialState });
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const requestCameraPermission = async () => {
        if (Platform.OS === 'android') {
            try {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.CAMERA,
                    {
                        title: 'Camera Permission',
                        message: 'App needs camera permission',
                        buttonPositive: "OK"
                    },
                );
                // If CAMERA Permission is granted
                return granted === PermissionsAndroid.RESULTS.GRANTED;
            } catch (err) {
                console.warn(err);
                return false;
            }
        } else return true;
    };

    const requestExternalWritePermission = async () => {
        if (Platform.OS === 'android') {
            try {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                    {
                        title: 'External Storage Write Permission',
                        message: 'App needs write permission',
                        buttonPositive: "OK"
                    },
                );
                // If WRITE_EXTERNAL_STORAGE Permission is granted
                return granted === PermissionsAndroid.RESULTS.GRANTED;
            } catch (err) {
                console.warn(err);
                AlertService.show(ENUM.E_ERROR, '', 5000, err);
            }
            return false;
        } else return true;
    };

    const captureImage = async (type: 'photo' | 'video' | 'mixed') => {
        let options: CameraOptions = {
            mediaType: type,
            maxWidth: 300,
            maxHeight: 550,
            quality: 1,
            videoQuality: 'low',
            durationLimit: 30, //Video max duration in seconds
            saveToPhotos: true,
        };
        let isCameraPermitted = await requestCameraPermission();
        let isStoragePermitted = await requestExternalWritePermission();
        if (isCameraPermitted && isStoragePermitted) {
            launchCamera(options, (response) => {
                console.log('Response = ', response);

                if (response.didCancel) {
                    AlertService.show(ENUM.E_ERROR, '', 5000, "User cancelled camera picker");
                    return;
                } else if (response.errorCode == 'camera_unavailable') {
                    AlertService.show(ENUM.E_ERROR, '', 5000, 'Camera not available on device');
                    return;
                } else if (response.errorCode == 'permission') {
                    AlertService.show(ENUM.E_ERROR, '', 5000, 'Permission not satisfied');
                    return;
                } else if (response.errorCode == 'others') {
                    AlertService.show(ENUM.E_ERROR, '', 5000, response.errorMessage);
                    return;
                }

                setState((prevState: IState) => ({
                    ...prevState,
                    filePath: Array.isArray(response?.assets) ? response?.assets[0] : undefined,
                    isShowModal: false,
                }));
            });
        }
    };

    const chooseFile = (type: 'photo' | 'video' | 'mixed') => {
        setIsLoading(true);
        let options: CameraOptions = {
            mediaType: type,
            maxWidth: 300,
            maxHeight: 550,
            quality: 1,
        };
        launchImageLibrary(options, (response) => {
            setIsLoading(false);
            if (response.didCancel) {
                AlertService.show(ENUM.E_ERROR, '', 5000, 'User cancelled camera picker');
                return;
            } else if (response.errorCode == 'camera_unavailable') {
                AlertService.show(ENUM.E_ERROR, '', 5000, 'Camera not available on device');
                return;
            } else if (response.errorCode == 'permission') {
                AlertService.show(ENUM.E_ERROR, '', 5000, 'Permission not satisfied');
                return;
            } else if (response.errorCode == 'others') {
                AlertService.show(ENUM.E_ERROR, '', 5000, response.errorMessage);
                return;
            }
            setState((prevState: IState) => ({
                ...prevState,
                filePath: Array.isArray(response?.assets) ? response?.assets[0] : undefined,
                isShowModal: false,
            }));
        });
    };

    useEffect(() => {
        if(filePath) {
            onComplete(filePath?.uri ? filePath?.uri : "");
        }
    }, [filePath]);

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <Modal
                animationType="slide"
                transparent={true}
                visible={isShowModal}
                onRequestClose={() => {
                    setState((prevState: IState) => ({
                        ...prevState,
                        isShowModal: false,
                    }));
                }}>
                <View style={{ flex: 1, backgroundColor: 'rgba(52, 52, 52, 0.3)' }}>
                    <Pressable style={{ flex: 1, }} onPress={() => {
                        setState((prevState: IState) => ({
                            ...prevState,
                            isShowModal: false,
                        }));
                    }}>

                    </Pressable>
                    <View style={{ width: "100%", height: 200, }}>
                        <View style={styles.contentModal}>
                            <TouchableOpacity
                                style={styles.btnChooseMethodPickImg}
                                onPress={() => {
                                    captureImage('photo');
                                }}
                            >
                                <Image source={require("../../global/assets/image/camera.png")} style={StylesTheme.wh32} />
                                <Text style={[StylesTheme.text16, { marginLeft: 12 }]}>Chụp ảnh mới</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.btnChooseMethodPickImg}
                                onPress={() => {
                                    chooseFile('mixed');
                                }}
                            >
                                <Image source={require("../../global/assets/image/picture.png")} style={StylesTheme.wh32} />
                                <Text style={[StylesTheme.text16, { marginLeft: 12 }]}>Chọn ảnh từ thư viên của bạn</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <TouchableOpacity style={{ width: 100, height: 100, borderRadius: 100, padding: 2, backgroundColor: Colors.black }}
                    onPress={() => {
                        setState((prevState: IState) => ({
                            ...prevState,
                            isShowModal: true,
                        }));
                    }}
                >
                    <View style={{ flex: 1, borderRadius: 100, justifyContent: 'center', alignItems: 'center' }}>
                        {
                            filePath && filePath?.uri ? (
                                <Image source={{ uri: filePath.uri }} style={{ width: 98, height: 98, borderRadius: 98 }} resizeMode={"stretch"} />
                            ) : (
                                <Image source={require("../../global/assets/image/man.png")} style={{ width: 98, height: 98, borderRadius: 98 }} />
                            )
                        }
                    </View>
                    {
                        isLoading && (
                            <View style={{ position: 'absolute', width: 100, height: 100, borderRadius: 100, justifyContent: 'center', alignItems: 'center' }}>
                                <Progress.Circle size={110} indeterminate={true} />
                            </View>
                        )
                    }
                </TouchableOpacity>
                <Text style={[StylesTheme.textLabel, { marginTop: 6 }]}>{label}</Text>
            </View>
        </SafeAreaView>
    );
};

export default ImagePicker;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: '#fff',
        alignItems: 'center',
    },
    titleText: {
        fontSize: 22,
        fontWeight: 'bold',
        textAlign: 'center',
        paddingVertical: 20,
    },
    textStyle: {
        padding: 10,
        color: 'black',
        textAlign: 'center',
    },
    buttonStyle: {
        alignItems: 'center',
        backgroundColor: '#DDDDDD',
        padding: 5,
        marginVertical: 10,
        width: 250,
    },
    imageStyle: {
        width: 200,
        height: 200,
        margin: 5,
    },
    btnChooseMethodPickImg: {
        width: '100%',
        borderBottomColor: "#ccc",
        borderBottomWidth: 0.5,
        paddingHorizontal: 12,
        paddingVertical: 16,
        flexDirection: 'row',
        alignItems: 'center'
    },
    contentModal: {
        flex: 1, backgroundColor: '#fff', borderTopLeftRadius: 20, borderTopRightRadius: 20, paddingTop: 20
    }
});