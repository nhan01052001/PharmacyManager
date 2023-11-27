import React from 'react';
import { useNavigation } from '@react-navigation/core';
import { StackNavigationProp } from '@react-navigation/stack';
import {
    SafeAreaView,
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    StatusBar,
} from 'react-native';

import StylesTheme from '../../global/theme/Styles.Theme';
import { HomeIcon, BackIcon } from '../../global/icon/Icon';
import { MainStackParams } from '../../navigation/Stack.Navigator';
import { ScreenName } from '../../navigation/Stack.Navigator';
import { RootStackParams } from '../../navigation/Stack.Navigator';
import { AllStackParams } from '../../navigation/Stack.Navigator';

interface IProps {
    titleHeader?: string;
    isOptionHome?: boolean;
    screenName?: ScreenName;
    goBack?: (() => void | any) | any,
    goHome?: (() => void | any) | any,
}

export const HeaderComponent: React.FC<IProps> = (props: IProps) => {
    const navigation = useNavigation<StackNavigationProp<AllStackParams>>();
    const { titleHeader, isOptionHome, screenName, goBack, goHome } = props;

    return (
        <View
            style={[
                StylesTheme.droidSafeArea,
                {
                    width: '100%',
                    backgroundColor: '#fff',
                    borderBottomWidth: 0.3,
                    borderBottomColor: '#ccc',
                    // position: 'absolute',
                    elevation: 99, zIndex: 99,
                },
            ]}
        >
            <StatusBar
                animated={true}
                backgroundColor="#fff"
                barStyle={'dark-content'}
            />
            <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                <View style={{ marginRight: 12, }}>
                    {isOptionHome ? (
                        <TouchableOpacity style={{ padding: 6, marginLeft: 6 }} onPress={() => goHome()}>
                            <HomeIcon size={32} color={'#000'} />
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity
                            style={{ padding: 6, marginLeft: 6, flexDirection: 'row', alignItems: 'center' }}
                            onPress={() => {
                                console.log("123");

                                if (screenName) {
                                    navigation.navigate(screenName);
                                } else
                                    goBack()
                            }}
                        >
                            <BackIcon size={26} color={'#000'} />
                        </TouchableOpacity>
                    )}
                </View>
                {/* Title header */}
                <View
                    style={[
                        {
                            flex: 1,
                            justifyContent: 'center',
                            alignItems: 'center',
                            maxWidth: '80%',
                        },
                        isOptionHome ? { marginRight: 38 } : { marginRight: 32 },
                    ]}
                >
                    <Text numberOfLines={1} style={{ fontSize: 18, fontWeight: '500' }}>
                        {titleHeader}
                    </Text>
                </View>
            </View>
        </View>
    );
}
