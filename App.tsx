/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import {NavigationContainer} from '@react-navigation/native';
import React from 'react';

import {createNativeStackNavigator} from '@react-navigation/native-stack';
import LivenessScreen from './src/pages/Liveness';
import LandingPage from './src/pages/LandingPage';
import Document from './src/pages/Document';
import ScanDocument from './src/pages/ScanDocument';
import CNICScanner from './src/pages/CNICScanner';

const Stack = createNativeStackNavigator();
const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={LandingPage}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Detection"
          component={LivenessScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Document"
          component={Document}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="ScanDocument"
          component={ScanDocument}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="CNICScanner"
          component={CNICScanner}
          options={{headerShown: false}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
