import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { LogBox } from 'react-native';
import { AppContextProvider } from './src/contexts/AppContext';
import AppNavigator from './src/navigation/AppNavigator';

// Import i18n configuration
import './src/i18n/i18n';

// Ignore specific warnings (optional)
LogBox.ignoreLogs([
  'Non-serializable values were found in the navigation state',
]);

export default function App() {
  useEffect(() => {
    // Any initialization logic can go here
  }, []);

  return (
    <AppContextProvider>
      <StatusBar style="auto" />
      <AppNavigator />
    </AppContextProvider>
  );
}