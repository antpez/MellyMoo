import { useGameplayStore } from '@/src/state/gameplay.slice';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ProgressBar, Text } from 'react-native-paper';

interface HUDProps {
  onPause: () => void;
}

export function HUD({ onPause }: HUDProps) {
  const { 
    score, 
    timeRemaining, 
    maxTime, 
    stickersFound, 
    bubbles,
    objectives
  } = useGameplayStore();

  const timeProgress = timeRemaining / maxTime;
  const friendMeter = Math.min(bubbles.length / 10, 1); // Fill as more bubbles appear
  
  // Calculate objective progress
  const primaryProgress = objectives?.primary ? objectives.primary.current / objectives.primary.target : 0;
  const secondaryProgress = objectives?.secondary ? objectives.secondary.current / objectives.secondary.target : 0;

  return (
    <View style={styles.container}>
      {/* Top Row */}
      <View style={styles.topRow}>
        <View style={styles.objectiveContainer}>
          <Text variant="bodySmall" style={styles.objectiveText}>
            🎯 {objectives?.primary?.description || 'Pop bubbles'}
          </Text>
          <ProgressBar 
            progress={Math.min(primaryProgress, 1)} 
            color="#4CAF50" 
            style={styles.objectiveBar}
          />
          {objectives?.secondary && (
            <>
              <Text variant="bodySmall" style={styles.objectiveText}>
                ⭐ {objectives.secondary.description}
              </Text>
              <ProgressBar 
                progress={Math.min(secondaryProgress, 1)} 
                color="#FF9800" 
                style={styles.objectiveBar}
              />
            </>
          )}
        </View>
        <View style={styles.timerContainer}>
          <ProgressBar 
            progress={timeProgress} 
            color="#FF6F61" 
            style={styles.timerBar}
          />
          <Text variant="bodySmall" style={styles.timerText}>
            {Math.ceil(timeRemaining)}s
          </Text>
        </View>
        <View style={styles.pauseContainer}>
          <Text 
            variant="bodyMedium" 
            onPress={onPause}
            accessibilityRole="button"
            accessibilityLabel="Pause game"
            accessibilityHint="Tap to pause the game"
          >
            ⏸️
          </Text>
        </View>
      </View>

      {/* Bottom Row */}
      <View style={styles.bottomRow}>
        <View style={styles.scoreContainer}>
          <Text 
            variant="titleMedium"
            accessibilityLabel={`Score: ${score} stars`}
          >
            ⭐ {score}
          </Text>
        </View>
        <View style={styles.friendContainer}>
          <Text 
            variant="bodyMedium"
            accessibilityLabel="Melly Moo friend meter"
          >
            🦆 Melly Moo
          </Text>
          <ProgressBar 
            progress={friendMeter} 
            color="#7A4CFF" 
            style={styles.friendBar}
            accessibilityLabel={`Friend meter: ${Math.round(friendMeter * 100)}% full`}
          />
        </View>
        <View style={styles.stickersContainer}>
          <Text 
            variant="bodyMedium"
            accessibilityLabel={`Stickers found: ${stickersFound}`}
          >
            📝 {stickersFound}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    pointerEvents: 'box-none',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 8,
  },
  objectiveContainer: {
    flex: 1,
  },
  objectiveText: {
    fontSize: 10,
    marginBottom: 2,
  },
  objectiveBar: {
    height: 4,
    borderRadius: 2,
    marginBottom: 4,
  },
  timerContainer: {
    flex: 2,
    paddingHorizontal: 16,
  },
  timerBar: {
    height: 8,
    borderRadius: 4,
  },
  timerText: {
    textAlign: 'center',
    marginTop: 4,
  },
  pauseContainer: {
    flex: 1,
    alignItems: 'flex-end',
  },
  bottomRow: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 50,
    paddingTop: 8,
  },
  scoreContainer: {
    flex: 1,
  },
  friendContainer: {
    flex: 2,
    paddingHorizontal: 16,
  },
  friendBar: {
    height: 6,
    borderRadius: 3,
    marginTop: 4,
  },
  stickersContainer: {
    flex: 1,
    alignItems: 'flex-end',
  },
});
