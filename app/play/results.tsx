import { getNextLevelConfig } from '@/src/features/play/config/LevelConfigs';
import { rollReward } from '@/src/services/rewards';
import { useProgressionStore } from '@/src/state';
import { useGameplayStore } from '@/src/state/gameplay.slice';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Dimensions, ScrollView, StyleSheet, useColorScheme, View } from 'react-native';
import { Button, Card, Text, useTheme } from 'react-native-paper';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function Results() {
  const colorScheme = useColorScheme();
  const paperTheme = useTheme();
  const isDark = colorScheme === 'dark';

  const params = useLocalSearchParams<{ theme?: string; level?: string }>();
  const gameTheme = (params?.theme as string) || 'farm';
  const level = Number(params?.level ?? '1') || 1;
  
  const { stars, stickersFound, score } = useGameplayStore();
  const { completeLevel, getNextLevel, getLevelProgress } = useProgressionStore();
  const [nextLevel, setNextLevel] = useState<number | null>(null);
  const [isLevelCompleted, setIsLevelCompleted] = useState(false);

  // Complete the current level and check for next level
  useEffect(() => {
    // Mark level as completed
    completeLevel(level, stars, score);
    setIsLevelCompleted(true);
    
    // Check for next level
    const next = getNextLevel();
    setNextLevel(next);
  }, [level, stars, score, completeLevel, getNextLevel]);

  async function handleContinue() {
    const reward = await rollReward({ theme: gameTheme, level });
    router.push({ pathname: '/play/reward-reveal', params: { key: reward.key, type: reward.type, title: reward.title ?? '' } });
  }

  function handleNextLevel() {
    if (nextLevel) {
      // Get the next level's theme
      const nextLevelConfig = getNextLevelConfig(nextLevel, SCREEN_WIDTH, SCREEN_HEIGHT);
      if (nextLevelConfig) {
        router.push({ 
          pathname: '/play/gameplay', 
          params: { 
            theme: nextLevelConfig.theme, 
            level: String(nextLevel),
            objective: 'surprise'
          } 
        });
      }
    }
  }

  function handleLevelSelect() {
    router.push('/play/setup');
  }

  function handleHome() {
    router.push('/home');
  }

  const dynamicStyles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 16,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: isDark ? '#000000' : '#FFFFFF',
    },
    card: {
      width: '100%',
      maxWidth: 400,
      marginBottom: 24,
      backgroundColor: isDark ? '#1A1A1A' : '#FFFFFF',
    },
    title: {
      marginBottom: 8,
      color: isDark ? '#FFFFFF' : '#000000',
      textAlign: 'center',
    },
    stats: {
      marginBottom: 24,
      color: isDark ? '#CCCCCC' : '#666666',
      textAlign: 'center',
    },
    buttonContainer: {
      width: '100%',
      maxWidth: 400,
      gap: 12,
    },
    button: {
      marginVertical: 4,
    },
    nextLevelButton: {
      backgroundColor: '#7A4CFF',
    },
    levelSelectButton: {
      backgroundColor: '#4CAF50',
    },
    homeButton: {
      backgroundColor: '#FF9800',
    },
  });

  if (!isLevelCompleted) {
    return (
      <View style={dynamicStyles.container}>
        <Text variant="headlineMedium" style={dynamicStyles.title}>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView 
      style={dynamicStyles.container}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
      bounces={true}
    >
      <Card style={dynamicStyles.card}>
        <Card.Content style={{ alignItems: 'center', padding: 24 }}>
          <Text variant="headlineMedium" style={dynamicStyles.title}>
            🎉 Level {level} Complete!
          </Text>
          <Text style={dynamicStyles.stats}>
            ⭐ Stars: {stars}  •  🏷️ Stickers: {stickersFound}  •  🎯 Score: {score}
          </Text>
          
          {nextLevel ? (
            <Text style={[dynamicStyles.stats, { marginBottom: 16, fontSize: 16, fontWeight: 'bold' }]}>
              🚀 Next Level Unlocked: Level {nextLevel}
            </Text>
          ) : (
            <Text style={[dynamicStyles.stats, { marginBottom: 16, fontSize: 16, fontWeight: 'bold' }]}>
              🏆 Congratulations! You've completed all levels!
            </Text>
          )}
        </Card.Content>
      </Card>

      <View style={dynamicStyles.buttonContainer}>
        <Button 
          mode="contained" 
          onPress={handleContinue}
          style={[dynamicStyles.button, dynamicStyles.nextLevelButton]}
        >
          🎁 Claim Reward
        </Button>
        
        {nextLevel && (
          <Button 
            mode="contained" 
            onPress={handleNextLevel}
            style={[dynamicStyles.button, dynamicStyles.nextLevelButton]}
          >
            🚀 Play Level {nextLevel}
          </Button>
        )}
        
        <Button 
          mode="contained" 
          onPress={handleLevelSelect}
          style={[dynamicStyles.button, dynamicStyles.levelSelectButton]}
        >
          🗺️ Level Select
        </Button>
        
        <Button 
          mode="contained" 
          onPress={handleHome}
          style={[dynamicStyles.button, dynamicStyles.homeButton]}
        >
          🏠 Home
        </Button>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
});
