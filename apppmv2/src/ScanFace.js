import React, { Component } from 'react';
import { View, Text, Image, TouchableOpacity, PixelRatio, Dimensions } from 'react-native';

class ScanFace extends Component {

    constructor(props) {
        super(props);
        this.state = {
            dataSource: [],
            file: null,
            sizeImage: {
                width: 0,
                height: 0
            }
        };
    }

    getDataItem = () => {
        try {
            const { file, data } = this.props?.navigation?.getState()?.routes[2]?.params;
            if (file && file?.uri) {
                Image.getSize(file?.uri, (width, height) => {
                    this.setState({
                        dataSource: data, file: file, sizeImage: {
                            width,
                            height
                        }
                    });
                });
            }
        } catch (error) {
            // go to screen error
        }
    }

    componentDidMount() {
        this.getDataItem();
    }

    render() {
        const { dataSource, file, sizeImage } = this.state;

        return file && file?.uri ? (
            <View
                style={{
                    flex: 1,
                }}
            >
                {
                    dataSource.map((item, index) => {
                        const caculatorLeft = Dimensions.get('window').width / (sizeImage?.width / item?.rectangle?.left);
                        const caculatorHeight = Dimensions.get('window').height / (sizeImage?.height / item?.rectangle?.top);
                        return (
                            <TouchableOpacity
                            key={index}
                                style={{
                                    position: 'absolute',
                                    elevation: 100,
                                    zIndex: 100,
                                    left: caculatorLeft,
                                    top: caculatorHeight,
                                    flexDirection: 'row',
                                    backgroundColor: '#444444',
                                    padding: 12,
                                    borderRadius: 8,
                                }}
                            >
                                <Text
                                    style={{
                                        color: 'red'
                                    }}
                                >{item?.name}</Text>

                            </TouchableOpacity>
                        )
                    })
                }
                <Image
                    source={{
                        uri: file.uri
                    }}
                    style={{
                        width: '100%',
                        height: '100%'
                    }}
                    resizeMode='stretch'
                />
            </View>
        ) : (
            <View style={{
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