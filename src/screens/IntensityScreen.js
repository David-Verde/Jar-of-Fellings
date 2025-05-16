import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppContext } from '../contexts/AppContext';

const { width } = Dimensions.get('window');

const IntensityScreen = ({ navigation }) => {
  const { t } = useTranslation();
  const { selectedEmotion, setEmotionIntensity } = useAppContext();
  const [selectedIntensity, setSelectedIntensity] = useState(null);
  
  // Animation values
  const thermometerAnimation = useRef(new Animated.Value(0)).current;
  const buttonsAnimation = useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    // Animate the thermometer and buttons in
    Animated.stagger(300, [
      Animated.spring(thermometerAnimation, {
        toValue: 1,
        tension: 40,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.spring(buttonsAnimation, {
        toValue: 1,
        tension: 40,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);
  
  const handleIntensitySelect = (intensity) => {
    setSelectedIntensity(intensity);
    setEmotionIntensity(intensity);
    
    // Animation for button selection
    Animated.timing(buttonsAnimation, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      // Navigate based on intensity
      if (intensity === 'high') {
        // For "high" intensity, show Psalms screen and then reset
        navigation.navigate('Psalms');
      } else {
        // For "low" or "medium", go directly to statements
        navigation.navigate('Statements');
      }
    });
  };
  
  // Animated styles
  const thermometerStyle = {
    opacity: thermometerAnimation,
    transform: [
      {
        translateY: thermometerAnimation.interpolate({
          inputRange: [0, 1],
          outputRange: [100, 0],
        }),
      },
    ],
  };
  
  const buttonsStyle = {
    opacity: buttonsAnimation,
    transform: [
      {
        translateY: buttonsAnimation.interpolate({
          inputRange: [0, 1],
          outputRange: [50, 0],
        }),
      },
    ],
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.contentContainer}>
        <Text style={styles.titleText}>{t('main.emotionIntensity')}</Text>
        
        {/* Thermometer visualization - COLORS INVERTED NOW */}
        <Animated.View style={[styles.thermometerContainer, thermometerStyle]}>
          <View style={styles.thermometerBackground}>
            <View style={styles.thermometerLevels}>
              <View style={[styles.thermometerLevel, styles.levelHigh]} />
              <View style={[styles.thermometerLevel, styles.levelMedium]} />
              <View style={[styles.thermometerLevel, styles.levelLow]} />
            </View>
            <View style={styles.thermometerLabels}>
              <Text style={styles.thermometerLabel}>{t('main.high')}</Text>
              <Text style={styles.thermometerLabel}>{t('main.medium')}</Text>
              <Text style={styles.thermometerLabel}>{t('main.low')}</Text>
            </View>
          </View>
        </Animated.View>
        
        {/* Intensity selection buttons */}
        <Animated.View style={[styles.buttonsContainer, buttonsStyle]}>
          <TouchableOpacity
            style={[styles.intensityButton, styles.highButton]}
            onPress={() => handleIntensitySelect('high')}
          >
            <Text style={styles.buttonText}>{t('main.high')}</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.intensityButton, styles.mediumButton]}
            onPress={() => handleIntensitySelect('medium')}
          >
            <Text style={styles.buttonText}>{t('main.medium')}</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.intensityButton, styles.lowButton]}
            onPress={() => handleIntensitySelect('low')}
          >
            <Text style={styles.buttonText}>{t('main.low')}</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  contentContainer: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  titleText: {
    fontSize: 24,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    marginBottom: 40,
  },
  thermometerContainer: {
    alignItems: 'center',
    marginBottom: 50,
    height: 250,
  },
  thermometerBackground: {
    width: width * 0.6,
    height: '100%',
    backgroundColor: '#eee',
    borderRadius: 20,
    overflow: 'hidden',
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  thermometerLevels: {
    flex: 3,
    flexDirection: 'column',
  },
  thermometerLevel: {
    flex: 1,
  },
  levelLow: {
    backgroundColor: '#4CAF50', // Green
  },
  levelMedium: {
    backgroundColor: '#FFC107', // Yellow/Amber
  },
  levelHigh: {
    backgroundColor: '#F44336', // Red
  },
  thermometerLabels: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    backgroundColor: 'rgba(255,255,255,0.7)',
  },
  thermometerLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  intensityButton: {
    flex: 1,
    padding: 15,
    borderRadius: 10,
    margin: 5,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  lowButton: {
    backgroundColor: '#4CAF50', // Green
  },
  mediumButton: {
    backgroundColor: '#FFC107', // Yellow/Amber
  },
  highButton: {
    backgroundColor: '#F44336', // Red
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default IntensityScreen;