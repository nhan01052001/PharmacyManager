import { useNavigation } from '@react-navigation/core';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, TextInput, Platform, FlatList } from 'react-native';

import TextInputComponent from '../../components/cTextInput/TextInput.component';
import { SearchIcon, BackIcon, HistoryIcon, CloseIcon } from '../../global/icon/Icon';
import StylesTheme from '../../global/theme/Styles.Theme';
import { Colors } from '../../global/theme/Colors.Theme';
import { AllStackParams } from '../../navigation/Stack.Navigator';

const SearchScreen: React.FC = () => {
    const navigation = useNavigation<StackNavigationProp<AllStackParams>>();

    const ItemHistory = (value: string) => {
        return (
            <TouchableOpacity style={{ padding: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}
            >
                <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                    <HistoryIcon size={24} color={Colors.colorGray_2} />
                    <Text style={[StylesTheme.text16, { marginLeft: 12 }]}>{value}</Text>
                </View>
                <TouchableOpacity style={{ paddingHorizontal: 12, }}>
                    <CloseIcon size={16} color={'red'} />
                </TouchableOpacity>
            </TouchableOpacity>
        )
    }

    return (
        <View style={{ flex: 1, backgroundColor: Colors.primaryColor }}>
            <View style={[{ flex: 1, backgroundColor: Colors.clWhite, marginTop: 35, paddingVertical: 12, }]}>
                <View style={{
                    paddingHorizontal: 12,
                    flexDirection: 'row',
                    alignItems: 'center',
                    borderBottomColor: Colors.colorGray_2,
                    borderBottomWidth: 0.5,
                    paddingBottom: 12,
                }}>
                    <TouchableOpacity
                        onPress={() => {
                            navigation.goBack()
                        }}
                    >
                        <BackIcon size={24} color={Colors.colorGray_2} />
                    </TouchableOpacity>
                    <View style={{
                        flex: 1,
                        marginLeft: 12,
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        borderColor: Colors.colorGrey,
                        borderWidth: 0.5,
                        borderRadius: 12,
                        paddingRight: 12,
                    }}>
                        <TextInputComponent
                            value={null}
                            onComplete={(text) => {

                            }}
                            placeholder={'Tìm kiếm'}
                            placeholderTextColor="#808080"
                            style={[styles.textInput, { flex: 1 }]}
                        />
                        <SearchIcon size={24} color={Colors.colorGray_2} />
                    </View>
                </View>

                <View style={{ padding: 12, paddingVertical: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Text style={[StylesTheme.textLabel, { fontSize: 16 }]}>Lịch sử tìm kiếm</Text>

                    <TouchableOpacity>
                        <Text style={[StylesTheme.textLabel, { fontSize: 16, color: 'red' }]}>Xoá tất cả</Text>
                    </TouchableOpacity>
                </View>

                <View style={{
                    borderBottomColor: Colors.colorGray_2,
                    borderBottomWidth: 0.5,
                }}>
                    <FlatList
                        data={[1, 2, 3, 4, 5]}
                        renderItem={({ item }) => ItemHistory('Nhỏ mắt')}
                        keyExtractor={item => item}
                    />
                </View>

                <View style={{ padding: 12, }}>
                    <Text style={[StylesTheme.textLabel]}>Tìm kiếm phổ biến</Text>
                    <FlatList
                        data={[1, 2, 3, 4, 5]}
                        renderItem={({ item }) => {
                            return (
                                <View style={{ flex: 1, }}>
                                    <View style={{ padding: 12, }}>
                                        <Text style={[StylesTheme.text16]}>- Thuốc</Text>
                                    </View>
                                </View>
                            )
                        }}
                        keyExtractor={item => item}
                    />
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
    },

    wrapTextInput: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
        width: '80%',
        borderRadius: 8,
    },

    textInput: {
        flex: 1,
        fontSize: 18,
        fontWeight: '500',
        color: '#000',
        padding: 10,
    },
});

export default SearchScreen;