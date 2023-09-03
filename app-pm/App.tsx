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


const App: React.FC = () => {

  return (
    <NavigationContainer>
      <RootStackNavigator />
    </NavigationContainer>
  )
}

export default App;
