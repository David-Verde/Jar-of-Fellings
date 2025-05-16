import React, { createContext, useState, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from 'react-i18next';

// Create the AppContext
const AppContext = createContext();

// Create a custom hook to use the AppContext
export const useAppContext = () => useContext(AppContext);

// Create the AppContextProvider component
export const AppContextProvider = ({ children }) => {
  const { i18n } = useTranslation();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [selectedEmotion, setSelectedEmotion] = useState(null);
  const [emotionIntensity, setEmotionIntensity] = useState(null); // 'low', 'medium', 'high'
  const [selectedStatement, setSelectedStatement] = useState(null);
  const [jarOpenState, setJarOpenState] = useState('closed'); // 'closed', 'opening', 'open', 'closing'
  const [statements, setStatements] = useState([]);
  const [shouldPlayVideo, setShouldPlayVideo] = useState(false);

  // Change language function
  const changeLanguage = async (language) => {
    await i18n.changeLanguage(language);
    await AsyncStorage.setItem('userLanguage', language);
  };

  // Initialize language preference from storage
const initLanguage = async () => {
  const storedLanguage = await AsyncStorage.getItem('userLanguage');
  if (storedLanguage) {
    i18n.changeLanguage(storedLanguage);
  } else {
    // Establecer español como predeterminado si no hay idioma guardado
    i18n.changeLanguage('es');
    await AsyncStorage.setItem('userLanguage', 'es');
  }
};

  // Reset the app state
  const resetAppState = () => {
    setSelectedEmotion(null);
    setEmotionIntensity(null);
    setSelectedStatement(null);
    setJarOpenState('closed');
    setStatements([]);
    setShouldPlayVideo(false);
  };

  // Function to close the jar (trigger closing animation)
  const closeJar = () => {
    setJarOpenState('closing');
    setShouldPlayVideo(true);
  };

  // Function to open the jar (trigger opening animation)
  const openJar = () => {
    setJarOpenState('opening');
    setShouldPlayVideo(true);
  };

  // Function to handle video playback completion
  const handleVideoEnd = () => {
    if (jarOpenState === 'opening') {
      setJarOpenState('open');
    } else if (jarOpenState === 'closing') {
      setJarOpenState('closed');
    }
    setShouldPlayVideo(false);
  };

  const contextValue = {
    isAuthenticated,
    setIsAuthenticated,
    selectedEmotion,
    setSelectedEmotion,
    emotionIntensity,
    setEmotionIntensity,
    selectedStatement,
    setSelectedStatement,
    jarOpenState,
    setJarOpenState,
    statements,
    setStatements,
    shouldPlayVideo,
    setShouldPlayVideo,
    changeLanguage,
    initLanguage,
    resetAppState,
    closeJar,
    openJar,
    handleVideoEnd,
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};

export default AppContext;