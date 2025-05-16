import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// Import screens
import LoginScreen from '../screens/LoginScreen';
import MainScreen from '../screens/MainScreen';
import EmotionsScreen from '../screens/EmotionsScreen';
import IntensityScreen from '../screens/IntensityScreen';
import PsalmsScreen from '../screens/PsalmsScreen';
import StatementsScreen from '../screens/StatementsScreen';
import FinalStatementScreen from '../screens/FinalStatementScreen';

// Create stack navigator
const Stack = createStackNavigator();

// App Navigator component
const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="Login"
        screenOptions={{
          headerShown: false,
          gestureEnabled: false,
        }}
      >
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Main" component={MainScreen} />
        <Stack.Screen name="Emotions" component={EmotionsScreen} />
        <Stack.Screen name="Intensity" component={IntensityScreen} />
        <Stack.Screen name="Psalms" component={PsalmsScreen} />
        <Stack.Screen name="Statements" component={StatementsScreen} />
        <Stack.Screen name="FinalStatement" component={FinalStatementScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;