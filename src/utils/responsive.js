import { Dimensions, Platform } from 'react-native';

export const isWeb = Platform.OS === 'web';
export const windowWidth = Dimensions.get('window').width;
export const windowHeight = Dimensions.get('window').height;

export const isLargeScreen = isWeb && windowWidth > 768;
export const isExtraLargeScreen = isWeb && windowWidth > 1200;