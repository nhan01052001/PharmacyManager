import React, { Component } from 'react';
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    Dimensions,
    Modal,
    ImageBackground,
    ScrollView,
} from 'react-native';
import { CloseIcon } from '../global/icon/Icon';

const window = Dimensions.get('window');
const isHorizontal = window.width > window.height;

const DATA_IMAGE = [
    {
        id: 1,
        path: 'https://firebasestorage.googleapis.com/v0/b/upload-image-f8fdc.appspot.com/o/image1.png?alt=media&token=9a5279e5-8c2d-4119-b890-d08cb39d717f',
    },
    {
        id: 2,
        path: 'https://firebasestorage.googleapis.com/v0/b/upload-image-f8fdc.appspot.com/o/image2.png?alt=media&token=02032639-dbf1-4ae9-a763-e14b94a125fb',
    },
    {
        id: 3,
        path: 'https://firebasestorage.googleapis.com/v0/b/upload-image-f8fdc.appspot.com/o/image3.png?alt=media&token=9ff7f4f8-67b4-45c1-8073-6122ab3bc661',
    },
    {
        id: 4,
        path: 'https://firebasestorage.googleapis.com/v0/b/upload-image-f8fdc.appspot.com/o/image31.png?alt=media&token=43a70715-c147-46aa-b99e-b1d85041bdc6',
    },
    {
        id: 5,
        path: 'https://firebasestorage.googleapis.com/v0/b/upload-image-f8fdc.appspot.com/o/image4.png?alt=media&token=d1e4a75a-62bb-49ac-8e58-a7820608e6bb',
    },
];

const DATA_SKILL_AND_CETIFICATION = [
    {
        id: 1,
        name: 'Đại học công nghệ thông tin',
    },
    {
        id: 2,
        name: 'ECBA',
    },
    {
        id: 3,
        name: 'UX/UI',
    },
    {
        id: 4,
        name: 'Ielts 7.0',
    },
    {
        id: 5,
        name: 'React Native',
    },
    {
        id: 6,
        name: 'Back-end .Net',
    },
    {
        id: 6,
        name: 'Angular',
    },
    {
        id: 7,
        name: 'React Js',
    },
];

class ScanFace extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataSource: [],
            file: null,
            sizeImage: {
                width: 0,
                height: 0,
            },
            modalVisible: false,
            dataChoose: null,
            isImageHorizontal: false,
            numberHorizontal: 0,
        };
    }

    getDataItem = () => {
        try {
            const { file, data, orientation } =
                this.props?.navigation?.getState()?.routes[2]?.params;
            if (file && file?.uri) {
                Image.getSize(file?.uri, (width, height) => {
                    this.setState({
                        dataSource: data,
                        file: file,
                        sizeImage: {
                            width,
                            height,
                        },
                        isImageHorizontal:
                            (orientation?.deviceOrientation === 3 &&
                                orientation?.pictureOrientation === 3) ||
                                (orientation?.deviceOrientation === 4 &&
                                    orientation?.pictureOrientation === 4)
                                ? true
                                : false,
                        numberHorizontal:
                            orientation?.pictureOrientation === orientation?.deviceOrientation
                                ? orientation?.deviceOrientation
                                : 0,
                    });
                });
            }
        } catch (error) {
            // go to screen error
        }
    };

    componentDidMount() {
        this.getDataItem();
    }

    getRandomNumber = () => {
        return Math.floor(Math.random() * 10) + 1;
    };

    render() {
        const {
            dataSource,
            file,
            sizeImage,
            modalVisible,
            dataChoose,
            isImageHorizontal,
            numberHorizontal,
        } = this.state;console.log(dataSource, 'dataSource');
        console.log(Dimensions.get('window').width, Dimensions.get('window').height, sizeImage?.width, '123');

        return file && file?.uri ? (
            <View
                style={{
                    flex: 1,
                }}>
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
                    onPress={() => { }}>
                    {/* <IconPrev size={32} color={'#fff'} /> */}
                </TouchableOpacity>
                {dataSource.map((item, index) => {
                    let caculatorLeft =
                        Dimensions.get('window').width /
                        (sizeImage?.width / item?.rectangle?.left) -
                        70;
                    let caculatorHeight =
                        Dimensions.get('window').height /
                        (sizeImage?.height / item?.rectangle?.top) -
                        30;
                    let lastName = null;

                    // if (isImageHorizontal) {
                    //     caculatorHeight =
                    //         Dimensions.get('window').width /
                    //         (sizeImage?.width / item?.rectangle?.left) -
                    //         70;

                    //     caculatorLeft =
                    //         Dimensions.get('window').height /
                    //         (sizeImage?.height / item?.rectangle?.top) -
                    //         30;

                    //     if (caculatorHeight < 0) {
                    //         caculatorHeight += 70;
                    //     }
                    // }

                    if (caculatorLeft < 0) {
                        caculatorLeft += 70;
                    }

                    if (item?.name && typeof item?.name === 'string') {
                        let lengthName = item?.name.split(' ').length;
                        lastName = item?.name.split(' ')[lengthName - 1];
                    }
                    return (
                        <TouchableOpacity
                            activeOpacity={0.7}
                            key={index}
                            style={{
                                position: 'absolute',
                                elevation: 100,
                                zIndex: 100,
                                left: caculatorLeft,
                                top: caculatorHeight,
                                flexDirection: 'row',
                                backgroundColor: '#444444',
                                paddingHorizontal: 8,
                                paddingVertical: 6,
                                borderRadius: 8,
                                alignItems: 'center',
                            }}
                            onPress={() => {
                                this.setState({ modalVisible: true, dataChoose: item });
                            }}>
                            <Text
                                style={{
                                    color: 'red',
                                    marginRight: 4,
                                }}>
                                {lastName ? lastName : ''}
                            </Text>
                            <Image source={require('../test/war.png')} />
                        </TouchableOpacity>
                    );
                })}
                <Image
                    source={{
                        uri: file.uri,
                    }}
                    style={
                        [
                            isImageHorizontal ? {
                                width: undefined,
                                height: '100%',
                                aspectRatio: 1,
                                alignSelf: 'center',
                            } : {
                                width: '100%',
                                height: '100%',
                            },
                            isImageHorizontal && {
                                transform: [
                                    {
                                        rotate:
                                            numberHorizontal === 3
                                                ? '90deg'
                                                : numberHorizontal === 4
                                                    ? '270deg'
                                                    : '0deg',
                                    },
                                ],
                            }
                        ]
                    }
                    resizeMode={isImageHorizontal ? 'contain' : 'stretch'}
                />

                {dataChoose && (
                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={modalVisible} //modalVisible
                        onRequestClose={() => {
                            this.setState({ modalVisible: false });
                        }}>
                        <View
                            style={{
                                flex: 1,
                                backgroundColor: '#fff',
                                marginTop: 35,
                            }}>
                            <View
                                style={{
                                    backgroundColor: '#FAFAFA',
                                    paddingHorizontal: 12,
                                    // paddingVertical: 12,
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                }}>
                                <View
                                    style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                    }}>
                                    <Image source={require('../test/idcard.png')} />
                                    <Text
                                        style={{
                                            fontSize: 14,
                                            fontWeight: 600,
                                            marginLeft: 8,
                                        }}>
                                        Thông tin nhân viên
                                    </Text>
                                </View>
                                <TouchableOpacity
                                    style={{
                                        padding: 12,
                                    }}
                                    onPress={() => {
                                        this.setState({ modalVisible: false });
                                    }}>
                                    <CloseIcon color="#000" size={18} />
                                </TouchableOpacity>
                            </View>

                            <ScrollView
                                style={{
                                    flex: 1,
                                }}>
                                {/* Nhân viên */}
                                <View
                                    style={{
                                        marginHorizontal: 12,
                                    }}>
                                    <View
                                        style={{
                                            marginVertical: 12,
                                        }}>
                                        <Text
                                            style={{
                                                fontSize: 16,
                                                fontWeight: 600,
                                            }}>
                                            Nhân viên
                                        </Text>
                                    </View>

                                    <View>
                                        <View
                                            style={{
                                                flexDirection: 'row',
                                                alignItems: 'center',
                                            }}>
                                            <View
                                                style={{
                                                    width: 56,
                                                    height: 56,
                                                    borderRadius: 56,
                                                    backgroundColor: '#444444',
                                                }}></View>

                                            <View
                                                style={{
                                                    marginLeft: 8,
                                                }}>
                                                <Text
                                                    style={{
                                                        fontSize: 16,
                                                        fontWeight: 600,
                                                        marginBottom: 2,
                                                    }}>
                                                    {dataChoose?.name}
                                                </Text>

                                                <View
                                                    style={{
                                                        flexDirection: 'row',
                                                        flexWrap: 'wrap',
                                                        alignItems: 'center',
                                                    }}>
                                                    <View
                                                        style={{
                                                            paddingHorizontal: 6,
                                                            paddingVertical: 2,
                                                            backgroundColor: '#f5f5f5',
                                                            borderRadius: 8,
                                                            alignSelf: 'baseline',
                                                            marginRight: 6,
                                                            marginTop: 2,
                                                        }}>
                                                        <Text
                                                            style={{
                                                                fontSize: 14,
                                                                fontWeight: '600',
                                                            }}>
                                                            Phòng ban R&D
                                                        </Text>
                                                    </View>
                                                    <View
                                                        style={{
                                                            paddingHorizontal: 6,
                                                            paddingVertical: 2,
                                                            backgroundColor: '#f5f5f5',
                                                            borderRadius: 8,
                                                            alignSelf: 'baseline',
                                                            marginTop: 2,
                                                        }}>
                                                        <Text
                                                            style={{
                                                                fontSize: 14,
                                                                fontWeight: '600',
                                                            }}>
                                                            UX/UI Designer
                                                        </Text>
                                                    </View>

                                                    <View
                                                        style={{
                                                            paddingHorizontal: 6,
                                                            paddingVertical: 2,
                                                            backgroundColor: '#f5f5f5',
                                                            borderRadius: 8,
                                                            alignSelf: 'baseline',
                                                            marginTop: 2,
                                                        }}>
                                                        <Text
                                                            style={{
                                                                fontSize: 14,
                                                                fontWeight: '600',
                                                            }}>
                                                            UX/UI Designer
                                                        </Text>
                                                    </View>
                                                </View>
                                            </View>
                                        </View>
                                    </View>
                                </View>

                                {/* Liên hệ */}
                                <View
                                    style={{
                                        marginHorizontal: 12,
                                    }}>
                                    <View
                                        style={{
                                            marginVertical: 12,
                                        }}>
                                        <Text
                                            style={{
                                                fontSize: 16,
                                                fontWeight: 600,
                                            }}>
                                            Liên hệ
                                        </Text>
                                    </View>

                                    <View>
                                        <View
                                            style={{
                                                flexDirection: 'row',
                                                alignItems: 'center',
                                                marginVertical: 4,
                                            }}>
                                            <View
                                                style={{
                                                    width: 30,
                                                    height: 30,
                                                    borderRadius: 30,
                                                    backgroundColor: '#f5f5f5',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    marginRight: 8,
                                                }}>
                                                <Image source={require('../test/phone.png')} />
                                            </View>

                                            <View>
                                                <Text
                                                    style={{
                                                        fontSize: 16,
                                                        fontWeight: 400,
                                                    }}>
                                                    090.0909.0909
                                                </Text>
                                            </View>
                                        </View>

                                        <View
                                            style={{
                                                flexDirection: 'row',
                                                alignItems: 'center',
                                                marginVertical: 4,
                                            }}>
                                            <View
                                                style={{
                                                    width: 30,
                                                    height: 30,
                                                    borderRadius: 30,
                                                    backgroundColor: '#f5f5f5',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    marginRight: 8,
                                                }}>
                                                <Image source={require('../test/mail.png')} />
                                            </View>

                                            <View>
                                                <Text
                                                    style={{
                                                        fontSize: 16,
                                                        fontWeight: 400,
                                                    }}>
                                                    dang.anh@vnresource.com
                                                </Text>
                                            </View>
                                        </View>

                                        <View
                                            style={{
                                                flexDirection: 'row',
                                                alignItems: 'center',
                                                marginVertical: 4,
                                            }}>
                                            <View
                                                style={{
                                                    width: 30,
                                                    height: 30,
                                                    borderRadius: 30,
                                                    backgroundColor: '#f5f5f5',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    marginRight: 8,
                                                }}>
                                                <Image source={require('../test/name.png')} />
                                            </View>

                                            <View>
                                                <Text
                                                    style={{
                                                        fontSize: 16,
                                                        fontWeight: 400,
                                                    }}>
                                                    Phạm Văn Hiển
                                                </Text>
                                            </View>
                                        </View>
                                    </View>
                                </View>

                                {/* Tương tác */}
                                <View
                                    style={{
                                        marginHorizontal: 12,
                                    }}>
                                    <View
                                        style={{
                                            marginVertical: 12,
                                        }}>
                                        <Text
                                            style={{
                                                fontSize: 16,
                                                fontWeight: 600,
                                            }}>
                                            Tương tác
                                        </Text>
                                    </View>

                                    <View>
                                        <View
                                            style={{
                                                flexDirection: 'row',
                                                alignItems: 'center',
                                                marginVertical: 4,
                                            }}>
                                            <View
                                                style={{
                                                    // width: 42,
                                                    // height: 42,
                                                    borderRadius: 100,
                                                    backgroundColor: '#f5f5f5',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    marginRight: 8,
                                                }}>
                                                <Image source={require('../test/giaoviec.png')} />
                                            </View>

                                            <View>
                                                <Text
                                                    style={{
                                                        fontSize: 16,
                                                        fontWeight: 400,
                                                    }}>
                                                    Giao việc
                                                </Text>
                                            </View>
                                        </View>

                                        <View
                                            style={{
                                                flexDirection: 'row',
                                                alignItems: 'center',
                                                marginVertical: 4,
                                            }}>
                                            <View
                                                style={{
                                                    // width: 42,
                                                    // height: 42,
                                                    borderRadius: 100,
                                                    backgroundColor: '#f5f5f5',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    marginRight: 8,
                                                }}>
                                                <Image source={require('../test/khenngoi.png')} />
                                            </View>

                                            <View>
                                                <Text
                                                    style={{
                                                        fontSize: 16,
                                                        fontWeight: 400,
                                                    }}>
                                                    Khen ngợi
                                                </Text>
                                            </View>
                                        </View>

                                        <View
                                            style={{
                                                flexDirection: 'row',
                                                alignItems: 'center',
                                                marginVertical: 4,
                                            }}>
                                            <View
                                                style={{
                                                    // width: 42,
                                                    // height: 42,
                                                    borderRadius: 100,
                                                    backgroundColor: '#f5f5f5',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    marginRight: 8,
                                                }}>
                                                <Image source={require('../test/trochuyen.png')} />
                                            </View>

                                            <View>
                                                <Text
                                                    style={{
                                                        fontSize: 16,
                                                        fontWeight: 400,
                                                    }}>
                                                    Trò chuyện
                                                </Text>
                                            </View>
                                        </View>
                                    </View>
                                </View>

                                {/* Trực thuộc */}
                                <View
                                    style={{
                                        marginHorizontal: 12,
                                    }}>
                                    <View
                                        style={{
                                            marginVertical: 12,
                                        }}>
                                        <Text
                                            style={{
                                                fontSize: 16,
                                                fontWeight: 600,
                                            }}>
                                            Trực thuộc
                                        </Text>
                                    </View>

                                    <View
                                        style={{
                                            paddingVertical: 8,
                                            backgroundColor: '#f5f5f5',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                        }}>
                                        <View
                                            style={{
                                                flexDirection: 'row',
                                                alignItems: 'center',
                                            }}>
                                            {DATA_IMAGE.map((item, index) => {
                                                return (
                                                    <View
                                                        key={index}
                                                        style={[
                                                            {
                                                                width: 32,
                                                                height: 32,
                                                                borderRadius: 32,
                                                                borderColor: '#fff',
                                                                borderWidth: 2,
                                                                backgroundColor: 'red',
                                                                alignItems: 'center',
                                                                justifyContent: 'center',
                                                            },
                                                            index !== 0 && { marginLeft: -8 },
                                                        ]}>
                                                        <Image
                                                            source={{
                                                                uri: item.path,
                                                            }}
                                                            style={{
                                                                width: 32,
                                                                height: 32,
                                                                borderRadius: 32,
                                                                borderColor: '#fff',
                                                                borderWidth: 2,
                                                            }}
                                                        />
                                                    </View>
                                                );
                                            })}
                                            <View
                                                style={[
                                                    {
                                                        width: 32,
                                                        height: 32,
                                                        borderRadius: 32,
                                                        borderColor: '#fff',
                                                        borderWidth: 2,
                                                        backgroundColor: '#f1f1f1',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        marginLeft: -8,
                                                    },
                                                ]}>
                                                <Text
                                                    style={{
                                                        color: '#000',
                                                        fontSize: 16,
                                                        fontWeight: 600,
                                                    }}>
                                                    +2
                                                </Text>
                                            </View>
                                        </View>

                                        <View
                                            style={{
                                                marginVertical: 8,
                                            }}>
                                            <Text
                                                style={{
                                                    fontSize: 16,
                                                    fontWeight: 600,
                                                }}>
                                                Phòng ban R&D
                                            </Text>
                                        </View>

                                        <View>
                                            <Text
                                                style={{
                                                    fontSize: 14,
                                                    fontWeight: 400,
                                                }}>
                                                7 nhân viên
                                            </Text>
                                        </View>
                                    </View>
                                </View>

                                {/* Xem chi tiết hồ sơ nhân viên */}
                                <View
                                    style={{
                                        marginHorizontal: 12,
                                    }}>
                                    <TouchableOpacity
                                        style={{
                                            paddingVertical: 12,
                                            marginVertical: 12,
                                            backgroundColor: '#f5f5f5',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                        }}>
                                        <Text
                                            style={{
                                                fontSize: 16,
                                                fontWeight: 400,
                                            }}>
                                            Xem chi tiết hồ sơ nhân viên
                                        </Text>
                                    </TouchableOpacity>
                                </View>

                                {/* Kỹ năng & Chứng chỉ */}
                                <View
                                    style={{
                                        marginHorizontal: 12,
                                    }}>
                                    <View
                                        style={{
                                            marginVertical: 12,
                                        }}>
                                        <Text
                                            style={{
                                                fontSize: 16,
                                                fontWeight: 600,
                                            }}>
                                            Kỹ năng & Chứng chỉ
                                        </Text>
                                    </View>

                                    <View
                                        style={{
                                            flexDirection: 'row',
                                            flexWrap: 'wrap',
                                            alignItems: 'center',
                                        }}>
                                        {DATA_SKILL_AND_CETIFICATION.map((item, index) => {
                                            return (
                                                <View
                                                    key={index}
                                                    style={{
                                                        paddingHorizontal: 6,
                                                        paddingVertical: 2,
                                                        backgroundColor: '#f5f5f5',
                                                        borderRadius: 8,
                                                        alignSelf: 'baseline',
                                                        marginRight: 6,
                                                        marginTop: 2,
                                                        marginBottom: 4,
                                                    }}>
                                                    <Text
                                                        style={{
                                                            fontSize: 14,
                                                            fontWeight: '600',
                                                        }}>
                                                        {item?.name}
                                                    </Text>
                                                </View>
                                            );
                                        })}
                                    </View>
                                </View>

                                {/* Biểu đồ năng lực */}
                                <View
                                    style={{
                                        marginHorizontal: 12,
                                    }}>
                                    <View
                                        style={{
                                            marginVertical: 12,
                                        }}>
                                        <Text
                                            style={{
                                                fontSize: 16,
                                                fontWeight: 600,
                                            }}>
                                            Biểu đồ năng lực
                                        </Text>
                                    </View>

                                    <View
                                        style={{
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                        }}>
                                        <Image source={require('../test/bieudonangluc.png')} />
                                    </View>
                                </View>

                                {/* Xem lộ trình phát triển */}
                                <View
                                    style={{
                                        marginTop: 12,
                                        marginHorizontal: 12,
                                    }}>
                                    <TouchableOpacity
                                        style={{
                                            paddingVertical: 12,
                                            marginVertical: 12,
                                            backgroundColor: '#f5f5f5',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                        }}>
                                        <Text
                                            style={{
                                                fontSize: 16,
                                                fontWeight: 400,
                                            }}>
                                            Xem lộ trình phát triển
                                        </Text>
                                    </TouchableOpacity>
                                </View>

                                {/* end */}
                                <View
                                    style={{
                                        paddingBottom: 35,
                                    }}></View>
                            </ScrollView>
                        </View>
                    </Modal>
                )}
            </View>
        ) : (
            <View
                style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                }}>
                <Text>No data</Text>
            </View>
        );
    }
}

export default ScanFace;
