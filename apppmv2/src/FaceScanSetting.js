import React, { Component } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image, Dimensions } from 'react-native';
import {
    RNCamera,
    FaceDetector
} from 'react-native-camera'; // Import the necessary components
import { Colors } from './global/theme/Colors.Theme';
import * as Animatable from "react-native-animatable";

import * as Progress from 'react-native-progress';
import { LoadingService } from './components/cLoading/Loading.component';
import axios from 'axios';
import { SafeAreaConsumer } from 'react-native-safe-area-context';
import { AlertService } from './components/cAlert/Alert.component';
import { ENUM } from './global/enum';
import { BackIcon, ScanIcon } from './global/icon/Icon';

const SCREEN_WIDTH = Dimensions.get('screen').width;

// Define the total number of photos you want to take
const TOTAL_PHOTOS = 5;

// Define the total time span in which you want to take the photos (in milliseconds)
const TOTAL_TIME = 10 * 1000; // 10 minutes

// Calculate the interval between each photo
const INTERVAL = TOTAL_TIME / TOTAL_PHOTOS;
const dataDefault = [
    {
        index: 0,
        lable: 'Chụp chính diện',
        uri: null
    },
    {
        index: 1,
        lable: 'Nghiêng sang trái',
        uri: null
    },
    {
        index: 2,
        lable: 'Nghiêng sang phải',
        uri: null
    },
    {
        index: 3,
        lable: 'Nhìn lên trên',
        uri: null
    },
    {
        index: 4,
        lable: 'Nhìn xuống dưới',
        uri: null
    }
];
class FaceScanSetting extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isStarted: false,
            isShowingSuccess: false,
            photos: [...dataDefault],
            txtError: ''
        };
        this.camera = null;
        this.isCapturing = false;
        // this.listPhotos = [];
    }

    onFaceDetected = () => {
        this.setState({ isFaceDetected: true });
    };

    makeSlideOutTranslation(translationType, fromValue) {
        return {
            from: {
                [translationType]: SCREEN_WIDTH * -0.1
            },
            to: {
                [translationType]: fromValue
            }
        };
    }

    takePicture = async (camera) => {
        try {
            const { photos } = this.state;
            if (camera && camera.takePictureAsync) {
                const options = { quality: 0.1, base64: false };
                this.isCapturing = true;
                const data = await camera.takePictureAsync(options);

                const title = data.uri
                    .split('/')
                    .pop()
                    .split('#')[0]
                    .split('?')[0];

                const file = {
                    uri: data.uri,
                    name: title,
                    type: 'image/jpeg',
                    fileSize: data.height * data.width * 4,
                    temp: true,
                };


                // this.listPhotos.push(file);
                // const progress = (this.listPhotos.length / TOTAL_PHOTOS) * 100 / 100;

                // let indexItem = photos.findIndex(item => item.uri == null),
                //     itemfind = photos[indexItem];

                // photos[indexItem] = {
                //     ...itemfind,
                //     uri: data.uri,
                //     file: file
                // };
                // debugger

                // const progress = (itemfind.index + 1 / TOTAL_PHOTOS) * 100 / 100;
                // this.isCapturing = false;
                // this.setState({
                //     photos: photos,
                //     progress: progress,
                //     txtError: ''
                // });

                debugger
                // Phát hiện khuôn mặt trên ảnh đã chụp
                const faceDetectionOptions = {
                    mode: FaceDetector.Constants.Mode.fast,
                    detectLandmarks: FaceDetector.Constants.Landmarks.all,
                    runClassifications: FaceDetector.Constants.Classifications.none,
                };
                const faces = await FaceDetector.detectFacesAsync(data.uri, faceDetectionOptions);
                let indexItem = photos.findIndex(item => item.uri == null),
                    itemfind = photos[indexItem];
                if (this.validateFaceAngles(faces, itemfind.index)) {
                    photos[indexItem] = {
                        ...itemfind,
                        uri: data.uri,
                        file: file
                    };

                    const progress = (itemfind.index + 1 / TOTAL_PHOTOS) * 100 / 100;
                    this.isCapturing = false;
                    console.log({
                        photos: photos,
                        progress: progress,
                        txtError: ''
                    }, '111');
                    this.setState({
                        photos: photos,
                        progress: progress,
                        txtError: ''
                    });
                }
                else {
                    AlertService.show(ENUM.E_ERROR, itemfind.lable + ' không thành công', 5000);
                    this.isCapturing = false;
                    this.setState({
                        txtError: itemfind.lable + ' không thành công'
                    });
                }
            }
        } catch (error) {
            console.log(error, 'error');
        }
    };

    startContinuousCapture = (camera) => {
        //this.takePicture(camera);
        const { photos } = this.state;
        this.intervalId = setInterval(() => {
            console.log('intervalId');
            // If we've taken the total number of photos, clear the interval
            if (photos.filter(item => item.uri != null).length >= TOTAL_PHOTOS) {
                clearInterval(this.intervalId);
                console.log('saveAvatar');
                // this.saveAvatar();

                return;
            }

            // Otherwise, take a photo
            this.isCapturing == false && this.takePicture(camera);
            // Increment the counter
        }, INTERVAL);
    }

    started = (camera) => {
        this.setState({
            isStarted: true
        }, () => this.startContinuousCapture(camera))
    }

    componentWillUnmount() {
        this.intervalId && clearInterval(this.intervalId);
    }

    // saveAvatar = () => {
    //     const { photos } = this.state;

    //     if (photos && photos.length > 0) {
    //         VnrLoadingSevices.show();
    //         const formData = new FormData();

    //         photos.forEach((photo, index) => {
    //             formData.append('photos', photo.file);
    //         });

    //         const info = dataVnrStorage.currentUser.info,
    //             name = `${info.FullName}|${info.ImagePath}|${info.Email}|${info.ProfileID}|09 898 989 89|Phạm Văn Hiển`;

    //         formData.append('name', name);
    //         formData.append('store', '1');
    //         formData.append('collections', '');

    //         // const configs = {
    //         //     headers: {
    //         //         Accept: 'application/json',
    //         //         'Content-Type': 'multipart/form-data',
    //         //         'token': '6a556da33450471988b4d113efd75c4b',
    //         //     },
    //         // };

    //         axios.post('https://api.luxand.cloud/v2/person', formData, {
    //             headers: {
    //                 'token': '6a556da33450471988b4d113efd75c4b',
    //                 Accept: 'application/json',
    //                 'Content-Type': 'multipart/form-data',
    //             },
    //             maxContentLength: Infinity,
    //         })
    //             .then(res => {
    //                 VnrLoadingSevices.hide();
    //                 if (res?.status) {
    //                     if (res?.status == 'success') {
    //                         this.setState({ isShowingSuccess: true });
    // AlertService.show(ENUM.E_SUCCESS, 'Thiết lập khuôn mặt thành công!', 5000);
    //                     }
    //                     else if (res?.status == 'failure') {
    //                         this.resetScan();
    // AlertService.show(ENUM.E_ERROR, 'Không thể tìm thấy khuôn mặt trong ảnh đính kèm', 5000);
    //                     }
    //                 }
    //                 else {
    //                     this.resetScan();
    // AlertService.show(ENUM.E_ERROR, 'Không chụp được ảnh, vui lòng thử lại!', 5000);
    //                 }
    //             })
    //     }
    //     else {
    //         AlertService.show(ENUM.E_ERROR, 'Không chụp được ảnh, vui lòng thử lại!', 5000);
    //     }
    // }

    validateFaceAngles = (faces, indexface) => {
        if (faces && Array.isArray(faces) && faces.length > 0) {
            faces.forEach((face) => {
                // Kiểm tra các landmarks để xác định góc nhìn
                const landmarks = face.landmarks;
                const nose = landmarks['noseBase'];
                const leftEye = landmarks['leftEye'];
                const rightEye = landmarks['rightEye'];

                // Tính toán góc giữa mắt và mũi
                const angle = Math.atan2(rightEye.y - leftEye.y, rightEye.x - leftEye.x) * (180 / Math.PI);

                // Kiểm tra các điều kiện để xác định góc nhìn của khuôn mặt
                if (angle > -20 && angle < 20 && indexface == 0) {
                    console.log("Chụp chính diện khuôn mặt");
                    return true;
                } else if (angle <= -20 && indexface == 1) {
                    console.log("Nghiêng sang trái");
                    return true;
                } else if (angle >= 20 && indexface == 2) {
                    console.log("Nghiêng sang phải");
                    return true;
                }

                // Kiểm tra vị trí của mắt và mũi để xác định góc nhìn lên trên hoặc xuống dưới
                if (nose.y < leftEye.y && nose.y < rightEye.y && indexface == 3) {
                    console.log("Nhìn lên trên");
                    return true;
                } else if (nose.y > leftEye.y && nose.y > rightEye.y && indexface == 4) {
                    console.log("Nhìn xuống dưới");
                    return true;
                }

                return false;
            });
        }
        else {
            return false;
        }
    }

    resetScan = () => {
        this.setState({
            isStarted: false,
            isShowingSuccess: false,
            photos: [...dataDefault],
            progress: 0
        });
        this.listPhotos = [];
    }

    render() {
        const { isStarted, isShowingSuccess, progress, photos, txtError } = this.state;

        return (
            <View style={styles.container}>
                <RNCamera
                    key={'SCAN_FACE'}
                    captureAudio={false}
                    style={styles.preview}
                    type={RNCamera.Constants.Type.front}
                    faceDetectionClassifications={RNCamera.Constants.FaceDetection.Classifications.all}
                    faceDetectionLandmarks={RNCamera.Constants.FaceDetection.Landmarks.all}
                    faceDetectionMode={RNCamera.Constants.FaceDetection.Mode.fast}
                    flashMode={typeCamera}
                    androidCameraPermissionOptions={{
                        title: 'Permission to use camera',
                        message:
                            'We would like to use your camera for taking pictures in the GPS timekeeping screen',
                        buttonPositive: 'Ok',
                        buttonNegative: 'Cancel',
                    }}
                    androidRecordAudioPermissionOptions={{
                        title: 'Permission to use audio recording',
                        message: 'We need your permission to use your audio',
                        buttonPositive: 'Ok',
                        buttonNegative: 'Cancel',
                    }}>
                    {({ camera, status }) => {
                        if (status !== 'READY') {
                            return (
                                <View style={{ flex: 1 }} />
                            );
                        } else {
                            return (
                                <SafeAreaConsumer>
                                    {insets => {
                                        const stylePadding = { paddingBottom: insets.bottom, paddingTop: insets.top };
                                        return (
                                            <View style={styles.viewAll}>
                                                {
                                                    isShowingSuccess ? (
                                                        <View style={[styles.styFontSc, stylePadding, { backgroundColor: Colors.colorGrey, }]}>
                                                            <View style={styles.styheader}>
                                                                <TouchableOpacity style={styles.bntGoBack} onPress={() => {
                                                                    // DrawerServices.goBack()
                                                                }}>
                                                                    <BackIcon color='#000' size={16} />
                                                                </TouchableOpacity>
                                                                <Text style={[styles.text, styles.header, { color: Colors.clWhite }]}>Success</Text>
                                                                <Text style={[styles.text, styles.subtitle, { color: Colors.clWhite }]}>Thiết lập gương mặt thành công</Text>
                                                            </View>


                                                            <View style={styles.rectangle}>
                                                                <Text>IconCheckCirlceo</Text>
                                                                {/* <IconCheckCirlceo
                                                                    size={SCREEN_WIDTH * 0.5}
                                                                    color={Colors.clWhite}
                                                                /> */}
                                                            </View>
                                                        </View>
                                                    ) : (
                                                        <View
                                                            style={[
                                                                styles.styFontSc,
                                                                stylePadding,
                                                                !isStarted && {
                                                                    // backgroundColor: '#f5f5f5'
                                                                }]}
                                                        >
                                                            <View style={styles.styheader}>
                                                                <TouchableOpacity style={styles.bntGoBack} onPress={() => {
                                                                    // DrawerServices.goBack()
                                                                }}>
                                                                    <BackIcon color='#000' size={16} />
                                                                </TouchableOpacity>
                                                                <Text style={[styles.text, styles.header]}>Thiết lập khuôn mặt</Text>
                                                                <Text style={[styles.text, styles.subtitle]}>Vui lòng giữ gương mặt ở giữa khung hình, di chuyển khuôn mặt để camera bắt được nhiều góc cạnh của gương mặt</Text>

                                                            </View>


                                                            <View style={styles.rectangle}>
                                                                <Image source={require('./test/scanning.png')} style={{
                                                                    width: SCREEN_WIDTH * 0.5,
                                                                    height: SCREEN_WIDTH * 0.5
                                                                }} />
                                                                <Animatable.View
                                                                    style={styles.scanBar}
                                                                    direction="alternate-reverse"
                                                                    iterationCount="infinite"
                                                                    duration={1700}
                                                                    easing="linear"
                                                                    animation={this.makeSlideOutTranslation(
                                                                        "translateY",
                                                                        SCREEN_WIDTH * - 0.45
                                                                    )}
                                                                />
                                                            </View>

                                                            {
                                                                !isStarted ? (
                                                                    <View style={styles.styBtnPrimary}>
                                                                        <TouchableOpacity style={styles.button} onPress={() => this.started(camera)}>
                                                                            <Text style={[styles.text, styles.buttonText]}>Bắt đầu thiết lập</Text>
                                                                        </TouchableOpacity>
                                                                        <TouchableOpacity style={styles.notNowButton} onPress={() => {
                                                                            // DrawerServices.goBack()
                                                                        }}>
                                                                            <Text style={[styles.text, styles.notNowText]}>Lúc khác</Text>
                                                                        </TouchableOpacity>
                                                                    </View>
                                                                ) : (
                                                                    <View style={styles.styBtnPrimary}>
                                                                        <Text style={[styles.text, { color: 'red' }]}>
                                                                            {txtError}
                                                                        </Text>

                                                                        <Progress.Bar
                                                                            backgroundColor={Colors.clWhite}
                                                                            progress={progress}
                                                                            width={WITHD_PROGRESS}
                                                                            color={Colors.colorGrey}
                                                                            height={1}
                                                                        />

                                                                        <ScrollView horizontal={true} style={styles.containerImage}>
                                                                            {
                                                                                photos.map(item => {
                                                                                    return item.uri ? (
                                                                                        <View style={styles.styViewImage}>
                                                                                            <Image source={{ uri: item.uri }} style={styles.ImgSize} />
                                                                                            <Text style={[styles.text, styles.txtImg]}>
                                                                                                {item.lable}
                                                                                            </Text>
                                                                                        </View>

                                                                                    ) : (
                                                                                        <View style={styles.styViewImage}>
                                                                                            <View style={styles.ImgSize} />
                                                                                            <Text style={[styles.text, styles.txtImg]}>
                                                                                                {item.lable}
                                                                                            </Text>
                                                                                        </View>
                                                                                    )
                                                                                })
                                                                            }
                                                                        </ScrollView>
                                                                    </View>
                                                                )
                                                            }
                                                        </View >
                                                    )
                                                }
                                            </View>
                                        )
                                    }}
                                </SafeAreaConsumer>
                            );
                        }
                    }}
                </RNCamera>
            </View>
        );
    }
}

const WITHD_PROGRESS = SCREEN_WIDTH - (16 * 4);

const overlayColor = "rgba(0,0,0,0.5)"; // this gives us a black color with a 50% transparency
const rectDimensions = SCREEN_WIDTH * 0.65; // this is equivalent to 255 from a 393 device width
const scanBarWidth = SCREEN_WIDTH * 0.44; // this is equivalent to 180 from a 393 device width
const scanBarHeight = SCREEN_WIDTH * 0.0025; //this is equivalent to 1 from a 393 device width

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    viewAll: {
        flex: 1
    },
    containerImage: {
        height: 'auto',
        flexDirection: 'row',
        borderColor: Colors.colorGrey,
        borderWidth: 0.5,
        padding: 8,
        borderRadius: 5,
        marginTop: 8
    },
    styViewImage: {
        height: 'auto',
        width: 'auto',
        marginRight: 16,
        justifyContent: 'center',
        alignItems: 'center'
    },
    stytexImg: {
        color: Colors.colorGrey,
        textAlign: 'center',
        fontSize: 16
    },
    ImgSize: {
        backgroundColor: Colors.clWhite,
        height: SCREEN_WIDTH * 0.15,
        width: SCREEN_WIDTH * 0.15,
        marginRight: 8,
        marginBottom: 5,
        borderRadius: 5,
        resizeMode: 'cover'
    },
    styFontSc: {
        flex: 1,
        position: 'absolute',
        width: SCREEN_WIDTH,
        height: '100%',
        top: 0,
        left: 0,
        flexDirection: 'column',
        paddingHorizontal: 16 * 2
    },
    bntGoBack: {
        width: 44,
        height: 44,
        borderRadius: 8,
        // backgroundColor: Colors.clWhite,
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: -16,
        marginTop: 8
    },
    rectangle: {
        flexGrow: 1,
        alignItems: "center",
        justifyContent: "center",
        // backgroundColor: "transparent",
        paddingBottom: 16
    },
    leftAndRightOverlay: {
        height: SCREEN_WIDTH * 0.65,
        width: SCREEN_WIDTH,
        backgroundColor: overlayColor
    },
    styBtnPrimary: {
        paddingBottom: 16 * 2
    },
    scanBar: {
        width: scanBarWidth,
        height: scanBarHeight,
        backgroundColor: '#000'
    },
    styheader: {
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginVertical: 8
    },
    subtitle: {
        fontSize: 16,
        marginBottom: 32,
    },
    preview: {
        flex: 1,
        height: Dimensions.get('screen').height,
        width: SCREEN_WIDTH,
    },
    successText: {
        fontSize: 18,
        color: 'green',
        marginTop: 16,
    },
    button: {
        backgroundColor: '#434343',
        padding: 12,
        borderRadius: 20,
        marginTop: 16,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        textAlign: 'center',
    },
    notNowButton: {
        marginTop: 16,
    },
    notNowText: {
        color: Colors.black,
        fontSize: 14,
        textAlign: 'center',
    },

    text: {
        fontSize: 16,
        fontWeight: '400',
        color: '#262626',
        includeFontPadding: false,
        paddingVertical: 6,
    },
});

export default FaceScanSetting;