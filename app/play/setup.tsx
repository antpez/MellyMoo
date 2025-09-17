import { generateLevelConfigs } from '@/src/features/play/config/LevelConfigs';
import { useProgressionStore } from '@/src/state';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Dimensions, ScrollView, StyleSheet, TouchableOpacity, useColorScheme, View } from 'react-native';
import { Button, Card, Text, useTheme } from 'react-native-paper';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const themes = [
  { value: 'farm', label: '🌾 Farm', color: '#8BC34A' },
  { value: 'beach', label: '🏖️ Beach', color: '#87CEEB' },
  { value: 'candy', label: '🍭 Candy', color: '#FFB6C1' },
  { value: 'space', label: '🚀 Space', color: '#9370DB' }
];

// Generate level positions using the new level configuration system
const generateLevelPositions = () => {
  const levelConfigs = generateLevelConfigs(SCREEN_WIDTH, SCREEN_HEIGHT);
  const positions = [];
  const levelSize = 50;
  const mapWidth = SCREEN_WIDTH - 60;
  const mapHeight = 350;
  const margin = 30;
  const cols = 5;
  const rows = 4;
  
  // Calculate spacing
  const horizontalSpacing = (mapWidth - levelSize) / (cols - 1);
  const verticalSpacing = (mapHeight - levelSize) / (rows - 1);
  
  for (let i = 0; i < 20; i++) {
    const row = Math.floor(i / cols);
    const col = i % cols;
    
    // True snake pattern: alternate direction for each row
    const actualCol = row % 2 === 0 ? col : (cols - 1 - col);
    
    // Calculate level number (bottom-up: 1-20)
    const levelNumber = 20 - i;
    
    // Get level config for this level
    const levelConfig = levelConfigs.find(config => config.level === levelNumber);
    const themeIndex = Math.floor((levelNumber - 1) / 5);
    
    positions.push({
      level: levelNumber,
      x: margin + actualCol * horizontalSpacing,
      y: margin + row * verticalSpacing,
      theme: themes[themeIndex].value,
      color: themes[themeIndex].color,
      config: levelConfig,
      // Store original col for path calculation
      originalCol: col,
      row: row
    });
  }
  
  // Sort by level number (1-20) for proper path connection
  return positions.sort((a, b) => a.level - b.level);
};

const levelPositions = generateLevelPositions();

export default function PlaySetup() {
  const colorScheme = useColorScheme();
  const paperTheme = useTheme();
  const isDark = colorScheme === 'dark';
  const { isLevelUnlocked, getLevelProgress, setCurrentLevel } = useProgressionStore();

  const [gameTheme, setGameTheme] = useState<string>('farm');
  const [selectedLevel, setSelectedLevel] = useState<number>(1);
  
  // Default objective - will be implemented later
  const objective = 'surprise';

  const handleLevelSelect = (level: number) => {
    // Only allow selecting unlocked levels
    if (isLevelUnlocked(level)) {
      setSelectedLevel(level);
      // Auto-select theme based on level
      const levelTheme = levelPositions.find(p => p.level === level)?.theme || 'farm';
      setGameTheme(levelTheme);
    }
  };

  const handleStart = () => {
    // Only allow starting unlocked levels
    if (isLevelUnlocked(selectedLevel)) {
      setCurrentLevel(selectedLevel);
      router.push({ 
        pathname: '/play/gameplay', 
        params: { theme: gameTheme, objective, level: String(selectedLevel) }
      });
    }
  };

  const dynamicStyles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDark ? '#000000' : '#F8F9FA',
    },
    levelMap: {
      width: SCREEN_WIDTH - 60,
      height: 380,
      position: 'relative',
      backgroundColor: isDark ? '#1A1A1A' : '#FFFFFF',
      borderRadius: 20,
      elevation: 6,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 12,
      borderWidth: 2,
      borderColor: isDark ? '#333333' : '#E0E0E0',
      overflow: 'hidden',
    },
    backgroundPattern: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: isDark ? '#0A0A0A' : '#F8F9FA',
      opacity: 0.3,
    },
    title: {
      textAlign: 'center',
      marginBottom: 24,
      fontWeight: 'bold',
      color: isDark ? '#FFFFFF' : '#333',
    },
    themeText: {
      color: isDark ? '#CCCCCC' : '#666',
      marginTop: 4,
    },
  });

  return (
    <View style={dynamicStyles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text variant="headlineSmall" style={dynamicStyles.title}>Choose Your Level</Text>
        
        {/* Level Map */}
        <View style={styles.mapContainer}>
          <View style={dynamicStyles.levelMap}>
            {/* Background grid pattern */}
            <View style={dynamicStyles.backgroundPattern} />
            {levelPositions.map((pos, index) => {
              const isUnlocked = isLevelUnlocked(pos.level);
              const isCompleted = getLevelProgress(pos.level)?.completed || false;
              const isSelected = selectedLevel === pos.level;
              
              return (
                <TouchableOpacity
                  key={pos.level}
                  style={[
                    styles.levelCircle,
                    {
                      left: pos.x,
                      top: pos.y,
                      backgroundColor: isUnlocked ? pos.color : '#CCCCCC',
                      borderColor: isSelected ? '#FFD700' : (isCompleted ? '#4CAF50' : pos.color),
                      borderWidth: isSelected ? 3 : 2,
                      opacity: isUnlocked ? 1.0 : 0.5,
                    }
                  ]}
                  onPress={() => handleLevelSelect(pos.level)}
                  disabled={!isUnlocked}
                  accessibilityLabel={`Level ${pos.level}${isCompleted ? ' (Completed)' : ''}${!isUnlocked ? ' (Locked)' : ''}`}
                  accessibilityHint={isUnlocked ? `Select level ${pos.level}` : 'Level is locked'}
                >
                  <Text style={[styles.levelNumber, { color: isUnlocked ? '#FFFFFF' : '#999999' }]}>
                    {pos.level}
                  </Text>
                  {isCompleted && (
                    <Text style={styles.completedIcon}>✓</Text>
                  )}
                  {!isUnlocked && (
                    <Text style={styles.lockedIcon}>🔒</Text>
                  )}
                </TouchableOpacity>
              );
            })}
            
               {/* Snake path lines */}
               {levelPositions.map((pos, index) => {
                 if (index === levelPositions.length - 1) return null;
                 const nextPos = levelPositions[index + 1];
                 
                 // Calculate line properties - connect to outer edges of circles
                 const circleRadius = 25; // Half of circle width (50/2)
                 
                 // Calculate direction vector
                 const deltaX = nextPos.x - pos.x;
                 const deltaY = nextPos.y - pos.y;
                 const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
                 
                 // Normalize direction vector
                 const dirX = deltaX / distance;
                 const dirY = deltaY / distance;
                 
                 // Calculate start and end points on circle edges
                 const startX = pos.x + circleRadius + (dirX * circleRadius);
                 const startY = pos.y + circleRadius + (dirY * circleRadius);
                 const endX = nextPos.x + circleRadius - (dirX * circleRadius);
                 const endY = nextPos.y + circleRadius - (dirY * circleRadius);
                 
                 // Calculate line length and angle
                 const lineDeltaX = endX - startX;
                 const lineDeltaY = endY - startY;
                 const length = Math.sqrt(lineDeltaX * lineDeltaX + lineDeltaY * lineDeltaY);
                 const angle = Math.atan2(lineDeltaY, lineDeltaX) * (180 / Math.PI);
                 
                 return (
                   <View
                     key={`path-${index}`}
                     style={[
                       styles.pathLine,
                       {
                         left: startX,
                         top: startY,
                         width: length,
                         height: 4,
                         backgroundColor: pos.color,
                         transform: [{ rotate: `${angle}deg` }],
                         transformOrigin: '0 0',
                       }
                     ]}
                   />
                 );
               })}
          </View>
        </View>

        {/* Selected Level Info */}
        <Card style={styles.infoCard}>
          <Card.Content>
            <Text variant="titleMedium">
              {levelPositions.find(p => p.level === selectedLevel)?.config?.name || `Level ${selectedLevel}`}
            </Text>
            <Text variant="bodyMedium" style={dynamicStyles.themeText}>
              {themes.find(t => t.value === gameTheme)?.label}
            </Text>
            <Text variant="bodySmall" style={[dynamicStyles.themeText, { marginTop: 8, fontStyle: 'italic' }]}>
              {levelPositions.find(p => p.level === selectedLevel)?.config?.description || ''}
            </Text>
            {levelPositions.find(p => p.level === selectedLevel)?.config?.objectives && (
              <View style={{ marginTop: 12 }}>
                <Text variant="bodySmall" style={[dynamicStyles.themeText, { fontWeight: 'bold' }]}>
                  Objective: {levelPositions.find(p => p.level === selectedLevel)?.config?.objectives.primary}
                </Text>
                {levelPositions.find(p => p.level === selectedLevel)?.config?.objectives.secondary && (
                  <Text variant="bodySmall" style={[dynamicStyles.themeText, { marginTop: 4 }]}>
                    Bonus: {levelPositions.find(p => p.level === selectedLevel)?.config?.objectives.secondary}
                  </Text>
                )}
              </View>
            )}
          </Card.Content>
        </Card>


        {/* Start Button */}
        <Button
          mode="contained"
          onPress={handleStart}
          style={[
            styles.startButton,
            { 
              backgroundColor: isLevelUnlocked(selectedLevel) ? '#7A4CFF' : '#CCCCCC',
              opacity: isLevelUnlocked(selectedLevel) ? 1.0 : 0.6,
            }
          ]}
          contentStyle={styles.startButtonContent}
          disabled={!isLevelUnlocked(selectedLevel)}
        >
          {isLevelUnlocked(selectedLevel) ? `Start Level ${selectedLevel}` : `Level ${selectedLevel} Locked`}
        </Button>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  mapContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  levelCircle: {
    position: 'absolute',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  levelNumber: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  completedIcon: {
    position: 'absolute',
    top: -5,
    right: -5,
    fontSize: 12,
    color: '#4CAF50',
    fontWeight: 'bold',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    width: 16,
    height: 16,
    textAlign: 'center',
    lineHeight: 16,
  },
  lockedIcon: {
    position: 'absolute',
    top: -5,
    right: -5,
    fontSize: 10,
  },
  pathLine: {
    position: 'absolute',
    height: 4,
    borderRadius: 2,
    opacity: 0.8,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  infoCard: {
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  startButton: {
    borderRadius: 25,
    elevation: 6,
    shadowColor: '#7A4CFF',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  startButtonContent: {
    paddingVertical: 8,
  },
});
