import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Keyboard,
  Platform,
  ScrollView,
  Dimensions
} from 'react-native';
import { Video } from 'expo-av';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { users } from '../data/users';
import { useAppContext } from '../contexts/AppContext';
import RNPickerSelect from 'react-native-picker-select';

const { width, height } = Dimensions.get('window');

const LoginScreen = ({ navigation }) => {
  const { t, i18n } = useTranslation();
  const { setIsAuthenticated, initLanguage, changeLanguage } = useAppContext();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [language, setLanguage] = useState('en');
  const [showPassword, setShowPassword] = useState(false);
  const passwordInputRef = useRef(null);

  useEffect(() => {
    // Inicializar con el idioma guardado o español por defecto
    const initializeLanguage = async () => {
      const storedLanguage = await AsyncStorage.getItem('userLanguage');
      if (storedLanguage) {
        setLanguage(storedLanguage);
        i18n.changeLanguage(storedLanguage);
      } else {
        // Si no hay idioma guardado, usar español por defecto
        setLanguage('es');
        i18n.changeLanguage('es');
        await AsyncStorage.setItem('userLanguage', 'es');
      }
    };
    initializeLanguage();
  }, []);

  const handleLogin = () => {
    const user = users.find(
      (user) => user.username === username && user.password === password
    );

    if (user) {
      setIsAuthenticated(true);
      navigation.replace('Main');
    } else {
      Alert.alert('Error', t('login.error'));
    }
  };
  const handleLanguageChange = async (value) => {
    setLanguage(value);
    await changeLanguage(value);
  };

  const focusPasswordField = () => {
    passwordInputRef.current?.focus();
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <ScrollView 
      contentContainerStyle={styles.scrollContainer}
      keyboardShouldPersistTaps="handled"
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.contentContainer}>
          <Text style={styles.title}>{t('login.title')}</Text>
          
          <View style={styles.videoContainer}>
            {Platform.OS === 'web' ? (
              <video
                src={require('../../assets/videos/jar_open.mp4')}
                style={{ width: '100%', borderRadius: 8, height: '100%' }}
                controls={false}
                playsInline
                muted
                autoPlay
              />
            ) : (
              <Video
                source={require('../../assets/videos/jar_open.mp4')}
                style={styles.video}
                resizeMode="contain"
                shouldPlay={false}
                isLooping={false}
                useNativeControls={false}
              />
            )}
          </View>

          <View style={styles.formContainer}>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder={t('login.username')}
                placeholderTextColor="#999"
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType={Platform.OS === 'ios' ? 'email-address' : 'default'}
                returnKeyType="next"
                onSubmitEditing={focusPasswordField}
                blurOnSubmit={false}
              />
            </View>
            
            <View style={styles.passwordContainer}>
              <TextInput
                ref={passwordInputRef}
                style={styles.passwordInput}
                placeholder={t('login.password')}
                placeholderTextColor="#999"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="done"
                onSubmitEditing={handleLogin}
              />
              <TouchableOpacity 
                style={styles.eyeIcon}
                onPress={toggleShowPassword}
              >
                <MaterialIcons 
                  name={showPassword ? 'visibility' : 'visibility-off'} 
                  size={24} 
                  color="#999" 
                />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.loginButton}
              onPress={handleLogin}
              activeOpacity={0.7}
            >
              <Text style={styles.loginButtonText}>{t('login.loginButton')}</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.languageContainer}>
            <Text style={styles.languageLabel}>{t('login.languageSelector')}:</Text>
            <RNPickerSelect
              onValueChange={handleLanguageChange}
              items={[
                { label: 'Español', value: 'es' },
                { label: 'English', value: 'en' },
              ]}
              value={language}
              style={pickerSelectStyles}
              placeholder={{}}
            />
          </View>
        </View>
      </SafeAreaView>
    </ScrollView>
  );
};

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 4,
    color: 'black',
    paddingRight: 30,
    backgroundColor: 'white',
    width: 150,
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 0.5,
    borderColor: 'gray',
    borderRadius: 8,
    color: 'black',
    paddingRight: 30,
    backgroundColor: 'white',
    width: 150,
  },
});

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    minHeight: height,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    padding: Platform.OS === 'ios' ? 20 : 15,
    paddingTop: height < 700 ? 10 : 20,
  },
  title: {
    fontSize: height < 700 ? 22 : 28,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 15,
    marginTop: height < 700 ? 5 : 15,
  },
  videoContainer: {
    width: '100%',
    aspectRatio: 1.46,
    alignSelf: 'center',
    marginVertical: 10,
    overflow: 'hidden',
    borderRadius: 8,
  },
  video: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  formContainer: {
    marginTop: height < 700 ? 5 : 15,
    marginBottom: 10,
  },
  inputContainer: {
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  input: {
    padding: 15,
    fontSize: 16,
    minHeight: Platform.OS === 'ios' ? 50 : 45,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  passwordInput: {
    flex: 1,
    padding: 15,
    fontSize: 16,
    minHeight: Platform.OS === 'ios' ? 50 : 45,
  },
  eyeIcon: {
    padding: 10,
    marginRight: 5,
  },
  loginButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  languageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  languageLabel: {
    fontSize: 16,
    marginRight: 10,
  },
});

export default LoginScreen;