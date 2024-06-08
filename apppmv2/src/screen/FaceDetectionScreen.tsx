import {useNavigation} from '@react-navigation/core';
import {StackNavigationProp} from '@react-navigation/stack';
import React, {useState} from 'react';
import {View, TouchableOpacity, Text, Image} from 'react-native';
import {RNCamera} from 'react-native-camera';
import axios from 'axios';

import {Colors} from '../global/theme/Colors.Theme';
import HttpService from '../service/HttpService.Service';
import {RootStackParams} from '../navigation/Stack.Navigator';

const BASEURL = 'https://api.luxand.cloud//photo/search/v2';

const FaceDetectionScreen = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParams>>();
  const [cameraType, setCameraType] = useState(RNCamera.Constants.Type.back);
  const [isCapturing, setIsCapturing] = useState(false);

  const takePicture = async function (camera: any) {
    if (camera && !isCapturing) {
      // Check if the camera is not currently capturing
      try {
        setIsCapturing(true); // Set isCapturing to true before capturing

        const options = {quality: 1, base64: false};
        const data = await camera.takePictureAsync(options);

        const title = data.uri.split('/').pop().split('#')[0].split('?')[0];
        const file = {
          uri: data.uri,
          name: title,
          type: 'image/jpeg',
          fileSize: data.height * data.width * 4,
          temp: true,
        };

        const formData = new FormData();

        formData.append('photo', {
          uri: file?.uri,
          name: file?.name,
          type: file?.type,
        });

        handleFaceAuthentication(formData, file, {
          pictureOrientation: data?.pictureOrientation,
          deviceOrientation: data?.deviceOrientation,
        });
      } catch (error) {
      } finally {
        setIsCapturing(false); // Set isCapturing back to false after capturing
      }
    }
  };

  const switchCamera = () => {
    setCameraType(
      cameraType === RNCamera.Constants.Type.back
        ? RNCamera.Constants.Type.front
        : RNCamera.Constants.Type.back,
    );
  };

  const handleFaceAuthentication = (
    formData: any,
    file: any,
    orientation: any,
  ) => {
    try {
      axios
        .post(BASEURL, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            token: '6a556da33450471988b4d113efd75c4b',
          },
        })
        .then(response => {
          console.log(response, 'response');

          if (Array?.isArray(response)) {
            navigation.navigate('ScanFace', {
              file,
              data: response,
              orientation,
            });
          }
        })
        .catch(error => {
          // Handle errors
          console.error('Error submitting form data:', error);
        });
    } catch (error) {}
  };

  return (
    <View style={{flex: 1}}>
      <TouchableOpacity
        style={{
          position: 'absolute',
          top: 30,
          left: 10,
          width: 58,
          height: 58,
          borderRadius: 13,
          backgroundColor: '#080808',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 100,
          elevation: 100,
        }}
        activeOpacity={0.8}
        onPress={() => {}}>
        {/* <IconPrev size={32} color={'#fff'} /> */}
      </TouchableOpacity>
      <RNCamera
        // ref={(ref) => {
        //     this.camera = ref;
        // }}
        captureAudio={false}
        style={{flex: 1}}
        type={cameraType}
        orientation={RNCamera.Constants.Orientation.auto}
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
        {({camera, status}) => {
          if (status !== 'READY') {
            return (
              <View>
                <Text>Loading</Text>
              </View>
            );
          } else {
            return (
              <View
                style={{
                  position: 'absolute',
                  bottom: 20,
                  width: '100%',
                  alignItems: 'center',
                }}>
                <View
                  style={{
                    // position: 'relative',
                    // bottom: 20,
                    // width: '100%',
                    flex: 1,
                    alignItems: 'center',
                  }}>
                  <TouchableOpacity
                    style={{
                      position: 'relative',
                      width: 60,
                      height: 60,
                      borderRadius: 60,
                      borderWidth: 4,
                      borderColor: '#080808',
                      justifyContent: 'center',
                      alignItems: 'center',
                      zIndex: 100,
                      elevation: 100,
                    }}
                    activeOpacity={0.8}
                    onPress={() => {
                      takePicture(camera);
                    }}>
                    <View
                      style={{
                        width: 50,
                        height: 50,
                        borderRadius: 50,
                        backgroundColor: '#fff',
                      }}
                    />
                  </TouchableOpacity>
                </View>
                <TouchableOpacity
                  style={{
                    position: 'absolute',
                    // bottom: 20,
                    right: 10,
                    width: 60,
                    height: 60,
                    borderRadius: 60,
                    backgroundColor: '#080808',
                    justifyContent: 'center',
                    alignItems: 'center',
                    zIndex: 100,
                    elevation: 100,
                  }}
                  activeOpacity={0.8}
                  onPress={switchCamera}>
                  {/* <Image
                                        source={require('../../assets/images/switchcamera.png')}
                                        style={{
                                            width: 32,
                                            height: 32,
                                        }}
                                    /> */}
                </TouchableOpacity>
              </View>
            );
          }
        }}
      </RNCamera>
    </View>
  );
};

export default FaceDetectionScreen;
