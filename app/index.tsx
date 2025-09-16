import { router } from 'expo-router';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Dimensions, Image, StyleSheet, View, useColorScheme } from 'react-native';
import { Button, useTheme } from 'react-native-paper';

const { width, height } = Dimensions.get('window');

export default function IndexScreen() {
  const { t } = useTranslation();
  const colorScheme = useColorScheme();
  const theme = useTheme();
  
  // Determine if we should use dark or light theme
  const isDark = colorScheme === 'dark';
  
  // Create dynamic styles based on theme
  const dynamicStyles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDark ? '#000000' : '#FFFFFF',
      justifyContent: 'center',
      alignItems: 'center',
    },
    background: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: isDark ? '#000000' : '#FFFFFF',
    },
    logo: {
      width: Math.min(width * 0.8, 400),
      height: Math.min(height * 0.6, 300),
      maxWidth: 400,
      maxHeight: 300,
      // Add a subtle shadow for light mode
      ...(isDark ? {} : {
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
      }),
    },
    playButton: {
      backgroundColor: '#7A4CFF',
      borderRadius: 25,
      paddingVertical: 8,
      elevation: 8,
      shadowColor: '#7A4CFF',
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.3,
      shadowRadius: 8,
    },
  });
  
  return (
    <View style={dynamicStyles.container}>
      {/* Background with gradient effect */}
      <View style={dynamicStyles.background} />
      
      {/* Logo Image */}
      <View style={styles.logoContainer}>
        <Image 
          source={require('@/assets/images/splash-icon.png')} 
          style={dynamicStyles.logo}
          resizeMode="contain"
        />
      </View>
      
      {/* Tap to Play Button */}
      <View style={styles.buttonContainer}>
        <Button 
          mode="contained" 
          onPress={() => router.replace('/home')}
          style={dynamicStyles.playButton}
          labelStyle={styles.playButtonText}
        >
          {t('title.tapToPlay')}
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  logoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 20,
  },
  buttonContainer: {
    paddingBottom: 60,
    paddingHorizontal: 20,
    width: '100%',
  },
  playButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});
