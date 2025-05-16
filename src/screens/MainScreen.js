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
import { isWeb, isLargeScreen, isExtraLargeScreen } from '../utils/responsive';

const { width, height } = Dimensions.get('window');

const MainScreen = ({ navigation }) => {
  const { t } = useTranslation();
  const { jarOpenState, setJarOpenState, resetAppState } = useAppContext();
  const videoRef = useRef(null);
  const webVideoRef = useRef(null);

  useEffect(() => {
    resetAppState();
  }, []);

  const handleJarPress = async () => {
    if (jarOpenState !== 'closed') return;
    setJarOpenState('opening');

    try {
      if (Platform.OS === 'web') {
        // Para la versión web
        if (webVideoRef.current) {
          webVideoRef.current.currentTime = 0; // Reiniciar el video
          webVideoRef.current.play();
        } else {
          console.log("Web video ref not ready, navigating directly...");
          setJarOpenState('open');
          navigation.navigate('Emotions');
        }
      } else {
        // Para móviles
        if (videoRef.current) {
          await videoRef.current.playAsync();
        } else {
          console.log("Video ref not ready, navigating directly...");
          setJarOpenState('open');
          navigation.navigate('Emotions');
        }
      }
    } catch (error) {
      console.error('Error playing video:', error);
      setJarOpenState('open');
      navigation.navigate('Emotions');
    }
  };

  const handleWebVideoEnd = () => {
    setJarOpenState('open');
    navigation.navigate('Emotions');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.contentContainer}>
        <TouchableOpacity
          activeOpacity={0.9}
          style={[styles.videoContainer, isWeb && styles.webVideoContainer]}
          onPress={handleJarPress}
          disabled={jarOpenState !== 'closed'}
        >
          {Platform.OS === 'web' ? (
            <video
              ref={webVideoRef}
              src={require('../../assets/videos/jar_close.mp4')}
              style={{ 
                width: '100%', 
                borderRadius: 8, 
                height: '100%',
                ...(isLargeScreen && {
                  maxWidth: '500px'
                })
              }}
              controls={false}
              playsInline
              muted
              onEnded={handleWebVideoEnd}
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
    ...(isLargeScreen && {
      justifyContent: 'center',
      alignItems: 'center',
    }),
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Platform.OS === 'ios' ? 20 : 15,
    ...(isLargeScreen && {
      paddingVertical: 40,
      width: '100%',
      maxWidth: 800,
    }),
  },
  videoContainer: {
    width: width * 0.85,
    height: (width * 0.85) * (960 / 656),
    maxHeight: height * 0.6,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    ...(isLargeScreen && {
      width: 400,
      height: 550,
    }),
    ...(isExtraLargeScreen && {
      width: 500,
      height: 650,
    }),
  },
  webVideoContainer: {
    ...(isWeb && {
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      ':hover': {
        transform: [{ scale: 1.02 }],
      },
    }),
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
    ...(isLargeScreen && {
      fontSize: 22,
      marginTop: 20,
    }),
  },
});

export default MainScreen;