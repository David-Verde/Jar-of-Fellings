import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
  Platform,
} from 'react-native';
import { Video } from 'expo-av';
import { useTranslation } from 'react-i18next';
import { useAppContext } from '../contexts/AppContext';

const { width, height } = Dimensions.get('window');

const MainScreen = ({ navigation }) => {
  const { t } = useTranslation();
  const { jarOpenState, setJarOpenState, resetAppState } = useAppContext();
  const videoRef = useRef(null);

  useEffect(() => {
    resetAppState();
  }, []);

  const handleJarPress = async () => {
    if (jarOpenState !== 'closed') return;
    setJarOpenState('opening');

    try {
      if (videoRef.current) {
        await videoRef.current.playAsync(); // Reproduce el video
      } else {
        console.log("Video ref not ready, navigating directly...");
        setJarOpenState('open');
        navigation.navigate('Emotions');
      }

      // Después de 4 segundos, navega a Emotions
      setTimeout(() => {
        setJarOpenState('open');
        navigation.navigate('Emotions');
      }, 4000); // 4 segundos

    } catch (error) {
      console.error('Error playing video:', error);
      setJarOpenState('open');
      navigation.navigate('Emotions');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.contentContainer}>
        <TouchableOpacity
          activeOpacity={0.9}
          style={styles.videoContainer}
          onPress={handleJarPress}
          disabled={jarOpenState !== 'closed'}
        >
          {Platform.OS === 'web' ? (
            <video
              src={require('../../assets/videos/jar_close.mp4')}
              style={{ width: '100%', borderRadius: 8, height: '100%' }}
              controls={false}
              playsInline
              muted
              autoPlay
              onEnded={() => {
                setJarOpenState('open');
                navigation.navigate('Emotions');
              }}
            />
          ) : (
            <Video
              ref={videoRef}
              source={require('../../assets/videos/jar_close.mp4')}
              style={styles.video}
              resizeMode="contain"
              shouldPlay={false}
              isLooping={false}
              useNativeControls={false}
              onPlaybackStatusUpdate={(status) => {
                if (status.didJustFinish) {
                  setJarOpenState('open');
                  navigation.navigate('Emotions');
                }
              }}
            />
          )}
        </TouchableOpacity>

        <View style={styles.instructionContainer}>
          <Text style={styles.instructionText}>
            {jarOpenState === 'opening' ? '...' : t('main.tapToOpen')}
          </Text>
        </View>
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
    alignItems: 'center',
    padding: Platform.OS === 'ios' ? 20 : 15,
  },
  videoContainer: {
    width: width * 0.85,
    height: (width * 0.85) * (960 / 656),
    maxHeight: height * 0.6,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  video: {
    width: '100%',
    height: '100%',
    backgroundColor: 'transparent',
  },
  instructionContainer: {
    marginTop: height < 700 ? 15 : 30,
    padding: 10,
  },
  instructionText: {
    fontSize: height < 700 ? 18 : 20,
    fontWeight: '500',
    color: '#555',
    textAlign: 'center',
  },
});

export default MainScreen;