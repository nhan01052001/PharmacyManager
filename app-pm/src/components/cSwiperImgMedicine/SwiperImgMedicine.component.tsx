import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions, FlatList } from 'react-native';
import Swiper from 'react-native-swiper';

const SwiperImgMedicine : React.FC<{ dataImg: any }> = ({dataImg}) => {
    return (
        <View style={styles.container}>
                <Swiper
                    key={dataImg.length}
                    style={{}}
                    showsButtons={false}
                    loop={true}
                    autoplay={true}
                    dot={
                        <View
                            style={{
                                backgroundColor: 'black',
                                width: 8,
                                height: 8,
                                borderRadius: 7,
                                marginLeft: 7,
                                marginRight: 7,
                            }}
                        />
                    }
                    activeDot={
                        <View
                            style={{
                                backgroundColor: 'red',
                                width: 10,
                                height: 10,
                                borderRadius: 7,
                                marginLeft: 7,
                                marginRight: 7,
                            }}
                        />
                    }
                    paginationStyle={{
                        bottom: 10,
                    }}
                >
                    {dataImg.map((item: any) => {
                        return (
                            <View style={styles.slide} key={item?.id}>
                                <Image
                                    source={{
                                        uri: item?.img,
                                    }}
                                    resizeMode={'contain'}
                                    style={styles.image}
                                />
                            </View>
                        );
                    })}
                </Swiper>
            </View>
    )
}

const styles = StyleSheet.create({
    container: {
        height: 150,
        backgroundColor: '#fff',
        width: '80%',
        borderRadius: 12,
        shadowOffset: { width: -2, height: 4 },
        shadowColor: '#171717',
        shadowOpacity: 0.2,
        shadowRadius: 3,
    },

    wrapContent: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-around',
    },

    image: {
        flex: 1,
    },
    slide: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent',
    },
});

export default SwiperImgMedicine;