import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useAppContext } from '../contexts/AppContext';
import { getEmotionById } from '../data/emotions';

const StatementsScreen = ({ navigation }) => {
  const { t, i18n } = useTranslation();
  const { selectedEmotion, setStatements, setSelectedStatement } = useAppContext();
  const [selectedItem, setSelectedItem] = useState(null);
  const [expanded, setExpanded] = useState(null);
  
  // Get current language
  const currentLanguage = i18n.language;
  const emotion = getEmotionById(selectedEmotion?.id);
  const statementAnimations = useRef(
    emotion?.statements[currentLanguage].map(() => new Animated.Value(0)) || []
  ).current;
  const buttonAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Store statements in context
    if (emotion) {
      setStatements(emotion.statements[currentLanguage]);
    }

    // Animate statements appearing
    Animated.stagger(100, 
      statementAnimations.map(anim => 
        Animated.spring(anim, {
          toValue: 1,
          tension: 40,
          friction: 7,
          useNativeDriver: true,
        })
      )
    ).start(() => {
      // Animate continue button after statements appear
      Animated.spring(buttonAnimation, {
        toValue: 1,
        tension: 40,
        friction: 7,
        useNativeDriver: true,
      }).start();
    });
  }, []);

  const handleSelectStatement = (statement, index) => {
    setSelectedItem(statement);
    setSelectedStatement(statement);
    setExpanded(index);
    
    // Highlight selected statement
    statementAnimations.forEach((anim, i) => {
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

  const handleContinue = () => {
    if (!selectedItem) return;
    
    // Fade out all content
    Animated.parallel([
      ...statementAnimations.map(anim => 
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
      navigation.navigate('FinalStatement');
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.titleText}>{t('main.chooseStatement')}</Text>
          
          <View style={styles.statementsContainer}>
            {emotion?.statements[currentLanguage].map((statement, index) => (
              <Animated.View
                key={index}
                style={[
                  styles.statementItem,
                  { 
                    opacity: statementAnimations[index],
                    transform: [
                      { 
                        translateY: statementAnimations[index].interpolate({
                          inputRange: [0, 1],
                          outputRange: [50, 0],
                        }),
                      },
                    ],
                    backgroundColor: selectedItem === statement 
                      ? emotion.colorCode 
                      : '#fff',
                    height: expanded === null || expanded === index ? 'auto' : 0,
                    overflow: 'hidden',
                    marginBottom: expanded === null || expanded === index ? 15 : 0,
                  },
                ]}
              >
                <TouchableOpacity
                  onPress={() => handleSelectStatement(statement, index)}
                  activeOpacity={0.8}
                >
                  <Text 
                    style={[
                      styles.statementText,
                      selectedItem === statement && styles.selectedStatementText,
                    ]}
                  >
                    {statement}
                  </Text>
                </TouchableOpacity>
              </Animated.View>
            ))}
          </View>
        </ScrollView>

        {/* Botón fijo en la parte inferior */}
        <Animated.View style={[
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
        ]}>
          <TouchableOpacity
            style={[
              styles.continueButton,
              { backgroundColor: emotion?.colorCode || '#4CAF50' },
              !selectedItem && styles.disabledButton,
            ]}
            onPress={handleContinue}
            disabled={!selectedItem}
          >
            <Text style={styles.buttonText}>{t('main.continue')}</Text>
          </TouchableOpacity>
        </Animated.View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 80, // Espacio para el botón fijo
  },
  titleText: {
    fontSize: 24,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    marginVertical: 20,
  },
  statementsContainer: {
    marginBottom: 30,
  },
  statementItem: {
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statementText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
  },
  selectedStatementText: {
    color: '#fff',
    fontWeight: '500',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    alignItems: 'center',
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
  disabledButton: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default StatementsScreen;