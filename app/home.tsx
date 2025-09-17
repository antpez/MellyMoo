import { useProgressionStore } from '@/src/state';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Dimensions, Image, ScrollView, StyleSheet, useColorScheme, View } from 'react-native';
import { Button, Card, Text, useTheme } from 'react-native-paper';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const theme = useTheme();
  const isDark = colorScheme === 'dark';
  const { 
    completedLevels, 
    getNextLevel, 
    isLevelUnlocked
  } = useProgressionStore();
  
  const [nextLevel, setNextLevel] = useState<number | null>(null);
  const [hasProgress, setHasProgress] = useState(false);

  // Check user's progress on component mount
  useEffect(() => {
    const next = getNextLevel();
    setNextLevel(next);
    setHasProgress(completedLevels.length > 0);
  }, [completedLevels, getNextLevel]);

  function handleContinue() {
    // Navigate to play setup screen to continue from next level
    router.push('/play/setup');
  }

  function handleStartFresh() {
    // Navigate to play setup screen
    router.push('/play/setup');
  }

  function handleLevelSelect() {
    router.push('/play/setup');
  }

  const dynamicStyles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 16,
      backgroundColor: isDark ? '#000000' : '#FFFFFF',
    },
    progressCard: {
      marginBottom: 16,
      backgroundColor: isDark ? '#1A1A1A' : '#FFFFFF',
      elevation: 4,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    progressTitle: {
      color: isDark ? '#FFFFFF' : '#000000',
      fontWeight: 'bold',
      marginBottom: 8,
    },
    progressText: {
      color: isDark ? '#CCCCCC' : '#666666',
      marginBottom: 4,
    },
    continueButton: {
      marginBottom: 8,
      paddingVertical: 10,
      borderRadius: 20,
      elevation: 6,
      shadowColor: '#4CAF50',
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.25,
      shadowRadius: 6,
      backgroundColor: '#4CAF50',
    },
    startFreshButton: {
      marginBottom: 16,
      paddingVertical: 10,
      borderRadius: 20,
      elevation: 6,
      shadowColor: '#7A4CFF',
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.25,
      shadowRadius: 6,
      backgroundColor: '#7A4CFF',
    },
    menuButton: {
      marginBottom: 6,
      paddingVertical: 6,
      paddingHorizontal: 12,
      borderRadius: 12,
      borderWidth: 1.5,
      borderColor: isDark ? '#333333' : '#E0E0E0',
      backgroundColor: isDark ? '#1A1A1A' : '#FAFAFA',
      elevation: 1,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.08,
      shadowRadius: 2,
    },
  });

  return (
    <View style={dynamicStyles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        bounces={true}
      >
        <View style={styles.logoContainer}>
          <Image
            source={require('@/assets/images/mellymoo_logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>
        
        <View style={styles.buttonContainer}>
        {/* Progress Card - Show if user has progress */}
        {hasProgress && (
          <Card style={dynamicStyles.progressCard}>
            <Card.Content>
              <Text variant="titleMedium" style={dynamicStyles.progressTitle}>
                🎮 Welcome Back!
              </Text>
              <Text style={dynamicStyles.progressText}>
                📊 Completed Levels: {completedLevels.length}/20
              </Text>
              {nextLevel && (
                <Text style={dynamicStyles.progressText}>
                  🚀 Next Level: {nextLevel}
                </Text>
              )}
              {completedLevels.length === 20 && (
                <Text style={[dynamicStyles.progressText, { color: '#4CAF50', fontWeight: 'bold' }]}>
                  🏆 All Levels Completed!
                </Text>
              )}
            </Card.Content>
          </Card>
        )}

        {/* Continue Button - Show if user has progress and next level available */}
        {hasProgress && nextLevel && isLevelUnlocked(nextLevel) && (
          <Button 
            mode="contained" 
            onPress={handleContinue} 
            style={dynamicStyles.continueButton}
            icon="play"
            contentStyle={styles.playButtonContent}
          >
            🚀 Continue Level {nextLevel}
          </Button>
        )}

        {/* Start Fresh Button */}
        <Button 
          mode="contained" 
          onPress={handleStartFresh} 
          style={dynamicStyles.startFreshButton}
          icon="refresh"
          contentStyle={styles.playButtonContent}
        >
          {hasProgress ? '🔄 Start Fresh' : '🎮 Play'}
        </Button>
        
        <View style={styles.menuGrid}>
          <Button 
            mode="outlined" 
            onPress={handleLevelSelect} 
            style={[dynamicStyles.menuButton, { borderColor: '#2196F3', backgroundColor: isDark ? '#1B2D3D' : '#E3F2FD' }]}
            icon="map"
            contentStyle={styles.menuButtonContent}
            textColor="#2196F3"
            labelStyle={styles.menuButtonLabel}
          >
            Level Select
          </Button>
          
          <Button 
            mode="outlined" 
            onPress={() => router.push('/sticker-book')} 
            style={[dynamicStyles.menuButton, { borderColor: '#4CAF50', backgroundColor: isDark ? '#1B2D1B' : '#F1F8E9' }]}
            icon="sticker-emoji"
            contentStyle={styles.menuButtonContent}
            textColor="#4CAF50"
            labelStyle={styles.menuButtonLabel}
          >
            Sticker Book
          </Button>
          
          <Button 
            mode="outlined" 
            onPress={() => router.push('/farmyard')} 
            style={[dynamicStyles.menuButton, { borderColor: '#8BC34A', backgroundColor: isDark ? '#1B2D1B' : '#F9FBE7' }]}
            icon="home"
            contentStyle={styles.menuButtonContent}
            textColor="#8BC34A"
            labelStyle={styles.menuButtonLabel}
          >
            Farmyard
          </Button>
          
          <Button 
            mode="outlined" 
            onPress={() => router.push('/wardrobe')} 
            style={[dynamicStyles.menuButton, { borderColor: '#9C27B0', backgroundColor: isDark ? '#2D1B2D' : '#F3E5F5' }]}
            icon="tshirt-crew"
            contentStyle={styles.menuButtonContent}
            textColor="#9C27B0"
            labelStyle={styles.menuButtonLabel}
          >
            Wardrobe
          </Button>
          
          <Button 
            mode="outlined" 
            onPress={() => router.push('/settings')} 
            style={[dynamicStyles.menuButton, { borderColor: '#607D8B', backgroundColor: isDark ? '#1B1B2D' : '#ECEFF1' }]}
            icon="cog"
            contentStyle={styles.menuButtonContent}
            textColor="#607D8B"
            labelStyle={styles.menuButtonLabel}
          >
            Settings
          </Button>
          
          <Button 
            mode="outlined" 
            onPress={() => router.push('/grownups')} 
            style={[dynamicStyles.menuButton, { borderColor: '#FF9800', backgroundColor: isDark ? '#2D1B0B' : '#FFF3E0' }]}
            icon="shield-account"
            contentStyle={styles.menuButtonContent}
            textColor="#FF9800"
            labelStyle={styles.menuButtonLabel}
          >
            Grown-ups
          </Button>
        </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20, // Extra padding at bottom for better scrolling
  },
  logoContainer: {
    alignItems: 'center',
    paddingVertical: 16,
    paddingTop: 20,
    paddingBottom: 24,
  },
  logo: {
    width: 240,
    height: 140,
    maxWidth: '85%',
  },
  buttonContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    paddingHorizontal: 20,
    paddingTop: 0,
  },
  playButtonContent: {
    paddingVertical: 6,
  },
  menuGrid: {
    gap: 8,
    marginBottom: 16,
  },
  menuButtonContent: {
    paddingVertical: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  menuButtonLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
});
