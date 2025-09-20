import { useProgressionStore } from '@/src/state';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Dimensions, Image, ScrollView, StyleSheet, useColorScheme, View } from 'react-native';
import { Button, Card, Text, useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

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
    if (nextLevel) {
      router.push(`/play/setup?level=${nextLevel}`);
    }
  }

  function handleStartFresh() {
    router.push('/play/setup');
  }


  

  const dynamicStyles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 5,
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
      marginBottom: 16,
      paddingVertical: 12,
      paddingHorizontal: 20,
      borderRadius: 20,
      elevation: 6,
      shadowColor: '#2196F3',
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.25,
      shadowRadius: 6,
      backgroundColor: '#2196F3',
    },
    startFreshButton: {
      marginBottom: 16,
      paddingVertical: 12,
      paddingHorizontal: 20,
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
      paddingVertical: 8,
      paddingHorizontal: 16,
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
    <SafeAreaView style={dynamicStyles.container} edges={['top', 'left', 'right']}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        bounces={true}
      >
        <View style={styles.bannerContainer}>
          <Image
            source={require('@/assets/images/home_banner.png')}
            style={styles.bannerImage}
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

        {/* Play Button - Only show if no Continue button is present */}
        {!(hasProgress && nextLevel && isLevelUnlocked(nextLevel)) && (
          <Button 
            mode="contained" 
            onPress={handleStartFresh} 
            style={dynamicStyles.startFreshButton}
            icon="play"
            contentStyle={styles.playButtonContent}
          >
            🎮 Play
          </Button>
        )}
        
        <View style={styles.menuGrid}>
          <Button 
            mode="contained" 
            onPress={() => router.push('/sticker-book')} 
            style={[dynamicStyles.menuButton, { backgroundColor: '#E91E63' }]}
            icon="sticker-emoji"
            contentStyle={styles.menuButtonContent}
            textColor="#FFFFFF"
            labelStyle={styles.menuButtonLabel}
          >
            Sticker Book
          </Button>
          
          <Button 
            mode="contained" 
            onPress={() => router.push('/farmyard')} 
            style={[dynamicStyles.menuButton, { backgroundColor: '#4CAF50' }]}
            icon="home"
            contentStyle={styles.menuButtonContent}
            textColor="#FFFFFF"
            labelStyle={styles.menuButtonLabel}
          >
            Farmyard
          </Button>
          
          <Button 
            mode="contained" 
            onPress={() => router.push('/wardrobe')} 
            style={[dynamicStyles.menuButton, { backgroundColor: '#9C27B0' }]}
            icon="tshirt-crew"
            contentStyle={styles.menuButtonContent}
            textColor="#FFFFFF"
            labelStyle={styles.menuButtonLabel}
          >
            Wardrobe
          </Button>
          
          <Button 
            mode="contained" 
            onPress={() => router.push('/settings')} 
            style={[dynamicStyles.menuButton, { backgroundColor: '#607D8B' }]}
            icon="cog"
            contentStyle={styles.menuButtonContent}
            textColor="#FFFFFF"
            labelStyle={styles.menuButtonLabel}
          >
            Settings
          </Button>
          
          <Button 
            mode="contained" 
            onPress={() => router.push('/grownups')} 
            style={[dynamicStyles.menuButton, { backgroundColor: '#FF9800' }]}
            icon="shield-account"
            contentStyle={styles.menuButtonContent}
            textColor="#FFFFFF"
            labelStyle={styles.menuButtonLabel}
          >
            Grown-ups
          </Button>
        </View>
        </View>
      </ScrollView>
    </SafeAreaView>
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
  bannerContainer: {
    width: '100%',
    height: 200,
    marginBottom: 16,
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bannerImage: {
    width: '100%',
    height: '100%',
  },
  
  buttonContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    paddingHorizontal: 16,
    paddingTop: 0,
  },
  playButtonContent: {
    paddingVertical: 8,
  },
  menuGrid: {
    gap: 8,
    marginBottom: 16,
  },
  menuButtonContent: {
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  menuButtonLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
});
