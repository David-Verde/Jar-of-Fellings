import React, { useRef, useEffect } from 'react';
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

const ReflectionScreen = ({ navigation }) => {
  const { t } = useTranslation();
  const { selectedEmotion, resetAppState, closeJar } = useAppContext();
  
  // Animaciones
  const textAnimation = useRef(new Animated.Value(0)).current;
  const buttonAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Animación de entrada
    Animated.sequence([
      Animated.timing(textAnimation, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(buttonAnimation, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleContinue = () => {
    // Animación de salida
    Animated.parallel([
      Animated.timing(textAnimation, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(buttonAnimation, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      resetAppState();
      closeJar();
      navigation.navigate('Main');
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.contentContainer}>
        <Animated.View style={[
          styles.textContainer,
          {
            opacity: textAnimation,
            transform: [{
              translateY: textAnimation.interpolate({
                inputRange: [0, 1],
                outputRange: [50, 0],
              }),
            }],
          },
        ]}>
          <Text style={styles.reflectionText}>
            {t('reflection.message')}
          </Text>
        </Animated.View>

        <Animated.View style={[
          styles.buttonContainer,
          {
            opacity: buttonAnimation,
            transform: [{
              translateY: buttonAnimation.interpolate({
                inputRange: [0, 1],
                outputRange: [50, 0],
              }),
            }],
          },
        ]}>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: selectedEmotion?.colorCode || '#4CAF50' }]}
            onPress={handleContinue}
          >
            <Text style={styles.buttonText}>{t('reflection.continue')}</Text>
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
    justifyContent: 'center',
    padding: 20,
  },
  textContainer: {
    marginBottom: 40,
  },
  reflectionText: {
    fontSize: 24,
    fontWeight: '500',
    color: '#333',
    textAlign: 'center',
    lineHeight: 34,
  },
  buttonContainer: {
    alignItems: 'center',
  },
  button: {
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default ReflectionScreen;