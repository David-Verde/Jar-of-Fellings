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
import { getEmotionById } from '../data/emotions';

const { width } = Dimensions.get('window');

const FinalStatementScreen = ({ navigation }) => {
  const { t, i18n } = useTranslation();
  const { 
    selectedEmotion, 
    selectedStatement, 
    resetAppState,
    closeJar 
  } = useAppContext();
  const emotion = getEmotionById(selectedEmotion?.id);
  
  // Get current language
  const currentLanguage = i18n.language;
  
  // Animation values
  const containerAnimation = useRef(new Animated.Value(0)).current;
  const statementAnimation = useRef(new Animated.Value(0)).current;
  const buttonAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Sequence animations
    Animated.sequence([
      Animated.spring(containerAnimation, {
        toValue: 1,
        tension: 40,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.spring(statementAnimation, {
        toValue: 1,
        tension: 40,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.spring(buttonAnimation, {
        toValue: 1,
        tension: 40,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleFinish = () => {
    // Fade out all content
    Animated.parallel([
      Animated.timing(containerAnimation, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(statementAnimation, {
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
      <Animated.View 
        style={[
          styles.contentContainer,
          {
            opacity: containerAnimation,
            transform: [
              {
                scale: containerAnimation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.9, 1],
                }),
              },
            ],
          },
        ]}
      >
        <Text style={styles.emotionTitle}>
          {emotion ? t(`emotions.${emotion.id}`) : ''}
        </Text>
        
        <Animated.View 
          style={[
            styles.statementContainer,
            {
              backgroundColor: emotion?.colorCode || '#4CAF50',
              opacity: statementAnimation,
              transform: [
                {
                  translateY: statementAnimation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [50, 0],
                  }),
                },
              ],
            },
          ]}
        >
          <Text style={styles.statementText}>{selectedStatement}</Text>
        </Animated.View>
        
        <Animated.View 
          style={[
            styles.buttonContainer,
            {
              opacity: buttonAnimation,
              transform: [
                {
                  translateY: buttonAnimation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [50, 0],
                  }),
                },
              ],
            },
          ]}
        >
          <TouchableOpacity
            style={styles.finishButton}
            onPress={handleFinish}
          >
            <Text style={styles.finishButtonText}>{t('main.finish')}</Text>
          </TouchableOpacity>
        </Animated.View>
      </Animated.View>
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
    alignItems: 'center',
  },
  emotionTitle: {
    fontSize: 28,
    fontWeight: '600',
    color: '#333',
    marginBottom: 40,
    textAlign: 'center',
  },
  statementContainer: {
    width: width * 0.9,
    borderRadius: 16,
    padding: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  statementText: {
    fontSize: 20,
    lineHeight: 30,
    color: '#fff',
    textAlign: 'center',
  },
  buttonContainer: {
    marginTop: 50,
    width: '100%',
    alignItems: 'center',
  },
  finishButton: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#333',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 30,
  },
  finishButtonText: {
    color: '#333',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default FinalStatementScreen;