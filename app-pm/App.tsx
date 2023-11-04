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
import Alert from './src/components/cAlert/Alert.component';
import { Provider } from 'react-redux';
import store from './src/redux/store.redux';


const App: React.FC = () => {

  return (
    <Provider store={store}>
      <AppProvider>
        <NavigationContainer>
          <Loading />
          <Alert />
          <RootStackNavigator />
        </NavigationContainer>
      </AppProvider>
    </Provider>
  )
}

export default App;
