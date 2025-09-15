import { Bubble, BubbleController } from '@/src/features/play/components/Bubble';
import { GameLoop } from '@/src/features/play/controllers/GameLoop';
import { HUD } from '@/src/features/play/hud/HUD';
import { BubbleSpawner, SpawnConfig } from '@/src/features/play/spawner/BubbleSpawner';
import { useGameplayStore } from '@/src/state/gameplay.slice';
import { router } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { Dimensions, StyleSheet, TouchableWithoutFeedback, View } from 'react-native';
import { Button, Text } from 'react-native-paper';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function Gameplay() {
  const gameLoopRef = useRef<GameLoop | null>(null);
  const spawnerRef = useRef<BubbleSpawner | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  const {
    isPlaying,
    isPaused,
    bubbles,
    timeRemaining,
    startGame,
    pauseGame,
    resumeGame,
    endGame,
    addBubble,
    removeBubble,
    updateBubbles,
    popBubble,
    setTimeRemaining,
  } = useGameplayStore();


  // Initialize game systems
  useEffect(() => {
    if (isInitialized) return;

    const config: SpawnConfig = BubbleSpawner.getFarmL1Config(SCREEN_WIDTH, SCREEN_HEIGHT);
    spawnerRef.current = new BubbleSpawner(config, SCREEN_WIDTH, SCREEN_HEIGHT);

    setIsInitialized(true);
    startGame();
  }, [isInitialized, startGame]);

  // Create game loop when game starts
  useEffect(() => {
    if (!isInitialized || !isPlaying) return;

    gameLoopRef.current = new GameLoop(
      (deltaTime) => {
        // Update game logic
        const currentState = useGameplayStore.getState();
        if (!currentState.isPlaying || currentState.isPaused) return;

        // Update time
        const newTime = Math.max(0, currentState.timeRemaining - deltaTime);
        currentState.setTimeRemaining(newTime);

        // Check for game end
        if (newTime <= 0) {
          currentState.endGame();
          return;
        }

        // Update bubbles
        const updatedBubbles = currentState.bubbles.map(bubble => 
          BubbleController.update(bubble, deltaTime)
        ).filter(bubble => !BubbleController.shouldCull(bubble, SCREEN_HEIGHT));

        // Spawn new bubbles
        if (spawnerRef.current) {
          const newBubbles = spawnerRef.current.update(performance.now(), updatedBubbles);
          updatedBubbles.push(...newBubbles);
        }

        currentState.updateBubbles(updatedBubbles);
      },
      (deltaTime) => {
        // Render logic (handled by React)
      }
    );

    return () => {
      if (gameLoopRef.current) {
        gameLoopRef.current.stop();
      }
    };
  }, [isInitialized, isPlaying]);

  // Start/stop game loop
  useEffect(() => {
    if (!gameLoopRef.current) return;

    if (isPlaying && !isPaused) {
      gameLoopRef.current.start();
    } else {
      gameLoopRef.current.stop();
    }
  }, [isPlaying, isPaused]);

  const handleTap = (event: any) => {
    // Background tap handler - bubbles have their own individual handlers
    if (!isPlaying || isPaused) return;
  };

  const handlePause = () => {
    if (isPaused) {
      resumeGame();
    } else {
      pauseGame();
    }
  };

  const handleFinish = () => {
    endGame();
    router.push('/play/results');
  };

  return (
    <View style={styles.container}>
      <TouchableWithoutFeedback onPress={handleTap}>
        <View style={styles.gameArea}>
          {/* Render bubbles */}
          {bubbles.map((bubble) => (
            <TouchableWithoutFeedback
              key={bubble.id}
              onPress={() => {
                popBubble(bubble.id);
              }}
            >
              <View
                style={[
                  styles.bubble,
                  {
                    left: bubble.x - bubble.radius,
                    top: bubble.y - bubble.radius,
                    width: bubble.radius * 2,
                    height: bubble.radius * 2,
                    backgroundColor: getBubbleColor(bubble),
                    borderRadius: bubble.radius,
                  },
                ]}
              />
            </TouchableWithoutFeedback>
          ))}

          {/* HUD Overlay */}
          <HUD onPause={handlePause} />

          {/* Pause Overlay */}
          {isPaused && (
            <View style={styles.pauseOverlay}>
              <Text variant="headlineMedium" style={styles.pauseText}>
                Paused
              </Text>
              <Button mode="contained" onPress={handlePause} style={styles.pauseButton}>
                Resume
              </Button>
              <Button mode="outlined" onPress={handleFinish} style={styles.pauseButton}>
                Quit
              </Button>
            </View>
          )}

          {/* Debug finish button */}
          <Button 
            mode="contained" 
            onPress={handleFinish}
            style={styles.debugButton}
          >
            Finish (Debug)
          </Button>
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
}

function getBubbleColor(bubble: Bubble): string {
  if (bubble.type === 'color' && bubble.color) {
    const colorMap: Record<string, string> = {
      red: '#FF6F61',
      blue: '#4A90E2',
      green: '#7ED321',
      yellow: '#F5A623',
      purple: '#9013FE',
    };
    return colorMap[bubble.color] || '#CCCCCC';
  }
  
  if (bubble.type === 'item') return '#FFD700';
  if (bubble.type === 'special') return '#FF69B4';
  if (bubble.type === 'avoider') return '#8B4513';
  
  return '#CCCCCC';
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#87CEEB', // Sky blue background
  },
  gameArea: {
    flex: 1,
    position: 'relative',
  },
  touchArea: {
    flex: 1,
    position: 'relative',
  },
  bubble: {
    position: 'absolute',
    borderWidth: 3,
    borderColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  pauseOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pauseText: {
    color: 'white',
    marginBottom: 32,
  },
  pauseButton: {
    marginVertical: 8,
    minWidth: 120,
  },
  debugButton: {
    position: 'absolute',
    bottom: 100,
    right: 16,
  },
});


