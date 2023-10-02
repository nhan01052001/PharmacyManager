/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useEffect } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  Platform,
  UIManager
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';

import { RootStackNavigator } from './src/navigation/Stack.Navigator';
import { AppProvider } from './src/context/App.provider';
import Loading from './src/components/cLoading/Loading.component';


const App: React.FC = () => {

  return (
    <AppProvider>
      <NavigationContainer>
        <Loading />
        <RootStackNavigator />
      </NavigationContainer>
    </AppProvider>
  )
}

export default App;
