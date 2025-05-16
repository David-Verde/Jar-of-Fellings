import { StyleSheet } from 'react-native';
import { isWeb, isLargeScreen } from '../utils/responsive';

export const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    ...(isWeb && {
      alignItems: 'center',
    }),
    ...(isLargeScreen && {
      justifyContent: 'center',
    }),
  },
  contentContainer: {
    flex: 1,
    ...(isLargeScreen && {
      width: 800,
      maxWidth: '80%',
      marginHorizontal: 'auto',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 10,
      borderRadius: 20,
      backgroundColor: '#fff',
      padding: 40,
    }),
  },
  webShadow: {
    ...(isWeb && {
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    }),
  },
});