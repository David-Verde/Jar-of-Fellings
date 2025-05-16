import React, { useRef, useEffect, useState } from 'react'; 
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  FlatList,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppContext } from '../contexts/AppContext';
import { emotions } from '../data/emotions';

const { width } = Dimensions.get('window');

const EmotionsScreen = ({ navigation }) => {
  const { t } = useTranslation();
  const { setSelectedEmotion } = useAppContext();
  const [isSelecting, setIsSelecting] = useState(false); // Nuevo estado
  
  // Animation values for emotion cards
  const emotionAnimations = useRef(
    emotions.map(() => new Animated.Value(0))
  ).current;
  
  useEffect(() => {
    // Staggered animation for emotions appearing
    Animated.stagger(
      100,
      emotionAnimations.map(anim => 
        Animated.spring(anim, {
          toValue: 1,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        })
      )
    ).start();
  }, []);
  
  const handleEmotionSelect = async (emotion) => {
    if (isSelecting) return; // Evitar múltiples selecciones
    setIsSelecting(true); // Bloquear selección
    
    setSelectedEmotion(emotion);
    
    // Animation for non-selected emotions to fade out
    const animationsArray = emotions.map((e, index) => {
      if (e.id !== emotion.id) {
        return Animated.timing(emotionAnimations[index], {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        });
      }
      return null;
    }).filter(Boolean);
    
    // Esperar a que todas las animaciones terminen
    await new Promise(resolve => {
      Animated.parallel(animationsArray).start(resolve);
    });
    
    // Navegar después de completar las animaciones
    navigation.navigate('Intensity');
  };
  
  const renderEmotionItem = ({ item, index }) => {
    const animatedStyle = {
      opacity: emotionAnimations[index],
      transform: [
        {
          scale: emotionAnimations[index].interpolate({
            inputRange: [0, 1],
            outputRange: [0.8, 1],
          }),
        },
        {
          translateY: emotionAnimations[index].interpolate({
            inputRange: [0, 1],
            outputRange: [50, 0],
          }),
        },
      ],
    };
    
    return (
      <Animated.View style={[styles.emotionItemContainer, animatedStyle]}>
        <TouchableOpacity
          style={[styles.emotionItem, { backgroundColor: item.colorCode }]}
          onPress={() => handleEmotionSelect(item)}
          activeOpacity={0.8}
          disabled={isSelecting} // Deshabilitar durante la selección
        >
          <Text style={styles.emotionText}>
            {t(`emotions.${item.id}`)}
          </Text>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.contentContainer}>
        <Text style={styles.titleText}>{t('main.chooseEmotion')}</Text>
        
        <FlatList
          data={emotions}
          renderItem={renderEmotionItem}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={styles.emotionColumnWrapper}
          contentContainerStyle={styles.emotionListContainer}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </SafeAreaView>
  );
};

// Los estilos permanecen igual que en tu versión original
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  contentContainer: {
    flex: 1,
    padding: 20,
  },
  titleText: {
    fontSize: 24,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    marginVertical: 30,
  },
  emotionListContainer: {
    paddingVertical: 10,
    alignItems: 'center',
  },
  emotionColumnWrapper: {
    justifyContent: 'space-between',
    width: '90%',
  },
  emotionItemContainer: {
    width: (width - 60) / 2,
    height: (width - 60) / 2,
    margin: 10,
    aspectRatio: 1,
  },
  emotionItem: {
    borderRadius: 15,
    padding: 20,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  emotionText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    textAlign: 'center',
  },
});

export default EmotionsScreen;