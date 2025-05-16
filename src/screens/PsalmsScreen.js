import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  ScrollView,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppContext } from '../contexts/AppContext';

const PsalmsScreen = ({ navigation }) => {
  const { t, i18n } = useTranslation();
  const { selectedEmotion, resetAppState, closeJar } = useAppContext();
  const [selectedPsalm, setSelectedPsalm] = useState(null);
  
  // Get current language
  const currentLanguage = i18n.language;
  
  // Animation values
  const titleAnimation = useRef(new Animated.Value(0)).current;
  const instructionAnimation = useRef(new Animated.Value(0)).current;
  const psalmAnimations = useRef(
    selectedEmotion?.psalms[currentLanguage].map(() => new Animated.Value(0)) || []
  ).current;
  const buttonAnimation = useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    // Staggered animations for elements to appear
    Animated.sequence([
      Animated.timing(titleAnimation, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(instructionAnimation, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.stagger(
        100, 
        psalmAnimations.map(anim => 
          Animated.spring(anim, {
            toValue: 1,
            tension: 40,
            friction: 7,
            useNativeDriver: true,
          })
        )
      ),
      Animated.timing(buttonAnimation, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);
  
  const handlePsalmSelect = (psalm, index) => {
    setSelectedPsalm(psalm);
    
    // Highlight the selected psalm and fade out others
    psalmAnimations.forEach((anim, i) => {
      if (i !== index) {
        Animated.timing(anim, {
          toValue: 0.3,
          duration: 300,
          useNativeDriver: true,
        }).start();
      } else {
        Animated.sequence([
          Animated.timing(anim, {
            toValue: 1.1,
            duration: 200,
            useNativeDriver: true,
          }),
          Animated.timing(anim, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
          }),
        ]).start();
      }
    });
  };
  
  const handleFinish = () => {
    // Fade out all content
    Animated.parallel([
      Animated.timing(titleAnimation, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(instructionAnimation, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      ...psalmAnimations.map(anim => 
        Animated.timing(anim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        })
      ),
      Animated.timing(buttonAnimation, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      resetAppState();
      closeJar();
navigation.navigate('Reflection');
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Animated.Text style={[styles.titleText, { opacity: titleAnimation }]}>
          {selectedEmotion ? t(`emotions.${selectedEmotion.id}`) : ''}
        </Animated.Text>
        
        <Animated.Text style={[styles.instructionText, { opacity: instructionAnimation }]}>
          {t('main.readAloud')}
        </Animated.Text>
        
        <View style={styles.psalmsContainer}>
          {selectedEmotion?.psalms[currentLanguage].map((psalm, index) => (
            <Animated.View 
              key={index}
              style={[
                styles.psalmItemContainer,
                { 
                  opacity: psalmAnimations[index],
                  transform: [
                    { scale: psalmAnimations[index] },
                  ],
                  backgroundColor: selectedPsalm === psalm 
                    ? selectedEmotion.colorCode 
                    : '#fff',
                }
              ]}
            >
              <TouchableOpacity
                style={styles.psalmItem}
                onPress={() => handlePsalmSelect(psalm, index)}
                activeOpacity={0.8}
              >
                <Text 
                  style={[
                    styles.psalmText,
                    selectedPsalm === psalm ? styles.selectedPsalmText : null
                  ]}
                >
                  {psalm}
                </Text>
              </TouchableOpacity>
            </Animated.View>
          ))}
        </View>
        
        <Animated.View style={[styles.buttonContainer, { opacity: buttonAnimation }]}>
          <TouchableOpacity
            style={[
              styles.continueButton,
              { backgroundColor: selectedEmotion?.colorCode || '#4CAF50' }
            ]}
            onPress={handleFinish}
          >
            <Text style={styles.buttonText}>{t('main.done')}</Text>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  titleText: {
    fontSize: 28,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    marginVertical: 20,
  },
  instructionText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#555',
    textAlign: 'center',
    marginBottom: 30,
  },
  psalmsContainer: {
    marginBottom: 30,
  },
  psalmItemContainer: {
    borderRadius: 12,
    marginBottom: 15,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  psalmItem: {
    padding: 16,
  },
  psalmText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
  },
  selectedPsalmText: {
    color: '#fff',
    fontWeight: '500',
  },
  buttonContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  continueButton: {
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

export default PsalmsScreen;