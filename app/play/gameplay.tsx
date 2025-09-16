import { Bubble, BubbleController } from '@/src/features/play/components/Bubble';
import { Director } from '@/src/features/play/controllers/Director';
import { GameLoop } from '@/src/features/play/controllers/GameLoop';
import { ParticleRenderer } from '@/src/features/play/effects/ParticleRenderer';
import { Particle, ParticleSystem } from '@/src/features/play/effects/ParticleSystem';
import { HUD } from '@/src/features/play/hud/HUD';
import { BubbleSpawner, SpawnConfig } from '@/src/features/play/spawner/BubbleSpawner';
import { useAppState } from '@/src/state';
import { useGameplayStore } from '@/src/state/gameplay.slice';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { Dimensions, Image, Pressable, Text as RNText, StyleSheet, TouchableWithoutFeedback, View } from 'react-native';
import { Button, Card, Divider, Switch, Text } from 'react-native-paper';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function Gameplay() {
  const gameLoopRef = useRef<GameLoop | null>(null);
  const spawnerRef = useRef<BubbleSpawner | null>(null);
  const directorRef = useRef<Director | null>(null);
  const particleSystemRef = useRef<ParticleSystem | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [showDevToggles, setShowDevToggles] = useState(false);
  const [slowMoEnabled, setSlowMoEnabled] = useState(false);
  const [spawnRateMultiplier, setSpawnRateMultiplier] = useState(1.0);
  const [deterministicSeed, setDeterministicSeed] = useState(false);
  const { colorAssist, reduceMotion, longPressMode } = useAppState();
  const params = useLocalSearchParams<{ theme?: string; objective?: string; level?: string }>();
  const selectedTheme = (params?.theme as string) || 'farm';
  const level = Number(params?.level ?? '1') || 1;

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
    resetGame,
  } = useGameplayStore();


  // (Re)initialize systems whenever level or theme changes
  useEffect(() => {
    // Stop any existing loop
    if (gameLoopRef.current) {
      gameLoopRef.current.stop();
    }

    const config: SpawnConfig = BubbleSpawner.getLevelConfig(level, SCREEN_WIDTH, SCREEN_HEIGHT);
    spawnerRef.current = new BubbleSpawner(config, SCREEN_WIDTH, SCREEN_HEIGHT);
    if (!particleSystemRef.current) {
      particleSystemRef.current = new ParticleSystem();
    }
    directorRef.current = new Director({ minIntervalMs: Math.max(250, config.interval - 150), maxIntervalMs: config.interval, rampDurationMs: 45000 });

    // Reset gameplay state and start fresh
    const s = useGameplayStore.getState();
    s.updateBubbles([]);
    s.setTimeRemaining(s.maxTime);
    s.startGame();

    setIsInitialized(true);
  }, [level, selectedTheme]);

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
          // Adjust spawn interval dynamically
          if (directorRef.current) {
            const interval = directorRef.current.getCurrentIntervalMs(performance.now());
            spawnerRef.current.setIntervalMs(interval);
          }
          const newBubbles = spawnerRef.current.update(performance.now(), updatedBubbles);
          updatedBubbles.push(...newBubbles);
        }

        // Update particles
        if (particleSystemRef.current) {
          const updatedParticles = particleSystemRef.current.updateParticles(deltaTime);
          setParticles(updatedParticles);
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
    router.push({ pathname: '/play/results', params: { theme: selectedTheme, level: String(level) } });
  };

  const handleGoToSetupDebug = () => {
    if (gameLoopRef.current) {
      gameLoopRef.current.stop();
    }
    endGame();
    router.push('/play/setup');
  };

  // Dev toggle handlers
  const handleSlowMoToggle = (value: boolean) => {
    setSlowMoEnabled(value);
    if (gameLoopRef.current) {
      gameLoopRef.current.setSlowMo(value);
    }
  };

  const handleSpawnRateChange = (value: number) => {
    setSpawnRateMultiplier(value);
    if (spawnerRef.current) {
      spawnerRef.current.setSpawnRateMultiplier(value);
    }
  };

  const handleDeterministicToggle = (value: boolean) => {
    setDeterministicSeed(value);
    if (spawnerRef.current) {
      spawnerRef.current.setDeterministic(value);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableWithoutFeedback onPress={handleTap}>
        <View style={styles.gameArea}>
          {/* Render bubbles */}
          {bubbles.map((bubble) => (
            <Pressable
              key={bubble.id}
              accessibilityRole="button"
              accessibilityLabel={`Pop ${bubble.color || bubble.type} bubble`}
              accessibilityHint={longPressMode ? "Long press to pop bubble" : "Tap to pop bubble"}
              onPress={() => {
                // Only pop on tap if long-press mode is disabled
                if (!longPressMode) {
                  // Create particle effect before popping (unless reduce motion is enabled)
                  if (!reduceMotion && particleSystemRef.current) {
                    const bubbleColor = getBubbleColor(bubble);
                    const burstParticles = particleSystemRef.current.createBurstPopEffect(
                      bubble.x, 
                      bubble.y, 
                      bubbleColor, 
                      8
                    );
                    const sparkleParticles = particleSystemRef.current.createSparkleEffect(
                      bubble.x, 
                      bubble.y, 
                      '#FFD700', // Gold sparkles
                      5
                    );
                    particleSystemRef.current.addParticles([...burstParticles, ...sparkleParticles]);
                  }
                  popBubble(bubble.id);
                }
              }}
              onLongPress={() => {
                // Pop on long-press when long-press mode is enabled
                if (longPressMode) {
                  // Create particle effect before popping (unless reduce motion is enabled)
                  if (!reduceMotion && particleSystemRef.current) {
                    const bubbleColor = getBubbleColor(bubble);
                    const burstParticles = particleSystemRef.current.createBurstPopEffect(
                      bubble.x, 
                      bubble.y, 
                      bubbleColor, 
                      8
                    );
                    const sparkleParticles = particleSystemRef.current.createSparkleEffect(
                      bubble.x, 
                      bubble.y, 
                      '#FFD700', // Gold sparkles
                      5
                    );
                    particleSystemRef.current.addParticles([...burstParticles, ...sparkleParticles]);
                  }
                  popBubble(bubble.id);
                }
              }}
              delayLongPress={500} // 500ms long-press delay
            >
              {bubble.type === 'color' ? (
                <Image
                  source={getBubbleImageSource(bubble.color, bubble.size)}
                  style={{
                    position: 'absolute',
                    left: bubble.x - bubble.radius,
                    top: bubble.y - bubble.radius,
                    width: bubble.radius * 2,
                    height: bubble.radius * 2,
                    resizeMode: 'contain',
                  }}
                />
              ) : (
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
              )}
              
              {/* Color Assist Glyph Overlay */}
              {colorAssist && (
                <View
                  style={{
                    position: 'absolute',
                    left: bubble.x - bubble.radius,
                    top: bubble.y - bubble.radius,
                    width: bubble.radius * 2,
                    height: bubble.radius * 2,
                    justifyContent: 'center',
                    alignItems: 'center',
                    pointerEvents: 'none',
                  }}
                >
                  <RNText
                    style={{
                      fontSize: Math.max(bubble.radius * 0.8, 12),
                      fontWeight: 'bold',
                      color: '#FFFFFF',
                      textShadowColor: '#000000',
                      textShadowOffset: { width: 1, height: 1 },
                      textShadowRadius: 2,
                      textAlign: 'center',
                    }}
                  >
                    {getAssistGlyph(bubble)}
                  </RNText>
                </View>
              )}
            </Pressable>
          ))}

          {/* Particle Effects (disabled when reduce motion is enabled) */}
          {!reduceMotion && <ParticleRenderer particles={particles} />}

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

          {/* Debug Panel */}
          <View style={styles.debugPanel}>
            <Button 
              mode="contained" 
              onPress={handleFinish}
              style={styles.debugButton}
            >
              Finish (Debug)
            </Button>
            <Button 
              mode="outlined" 
              onPress={handleGoToSetupDebug}
              style={styles.debugButtonLeft}
            >
              Setup (Debug)
            </Button>
            <Button 
              mode="text" 
              onPress={() => setShowDevToggles(!showDevToggles)}
              style={styles.devToggleButton}
            >
              {showDevToggles ? 'Hide' : 'Show'} Dev Toggles
            </Button>
          </View>

          {/* Dev Toggles Panel */}
          {showDevToggles && (
            <Card style={styles.devTogglesCard}>
              <Card.Content>
                <Text variant="titleMedium" style={styles.devTogglesTitle}>
                  Dev Toggles
                </Text>
                
                {/* Slow-mo toggle */}
                <View style={styles.toggleRow}>
                  <Text>Slow Motion</Text>
                  <Switch 
                    value={slowMoEnabled} 
                    onValueChange={handleSlowMoToggle}
                  />
                </View>
                
                <Divider style={styles.toggleDivider} />
                
                {/* Spawn rate multiplier */}
                <View style={styles.toggleRow}>
                  <Text>Spawn Rate: {spawnRateMultiplier.toFixed(1)}x</Text>
                </View>
                <View style={styles.sliderContainer}>
                  <Button 
                    mode="outlined" 
                    compact
                    onPress={() => handleSpawnRateChange(Math.max(0.1, spawnRateMultiplier - 0.1))}
                  >
                    -
                  </Button>
                  <Text style={styles.sliderValue}>{spawnRateMultiplier.toFixed(1)}x</Text>
                  <Button 
                    mode="outlined" 
                    compact
                    onPress={() => handleSpawnRateChange(Math.min(5.0, spawnRateMultiplier + 0.1))}
                  >
                    +
                  </Button>
                </View>
                
                <Divider style={styles.toggleDivider} />
                
                {/* Deterministic seed */}
                <View style={styles.toggleRow}>
                  <Text>Deterministic Seed</Text>
                  <Switch 
                    value={deterministicSeed} 
                    onValueChange={handleDeterministicToggle}
                  />
                </View>
              </Card.Content>
            </Card>
          )}
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
      pink: '#FF69B4',
    };
    return colorMap[bubble.color] || '#CCCCCC';
  }
  
  if (bubble.type === 'item') return '#FFD700';
  if (bubble.type === 'special') return '#FF69B4';
  if (bubble.type === 'avoider') return '#8B4513';
  
  return '#CCCCCC';
}

function getAssistGlyph(bubble: any): string {
  // Comprehensive, accessible glyph palette for Color Assist
  
  // Color bubbles - distinct shapes for each color
  if (bubble.type === 'color') {
    switch (bubble.color) {
      case 'red':
        return '▲'; // Triangle - sharp, attention-grabbing
      case 'blue':
        return '■'; // Square - stable, reliable
      case 'green':
        return '●'; // Circle - natural, organic
      case 'yellow':
        return '◆'; // Diamond - bright, energetic
      case 'purple':
        return '★'; // Star - special, magical
      case 'pink':
        return '♥'; // Heart - warm, friendly
      default:
        return '●';
    }
  }
  
  // Item bubbles - different shapes for different items
  if (bubble.type === 'item') {
    switch (bubble.item) {
      case 'flower':
        return '✿'; // Flower symbol
      case 'carrot':
        return '🥕'; // Carrot emoji
      case 'apple':
        return '🍎'; // Apple emoji
      case 'shell':
        return '🐚'; // Shell emoji
      case 'starfish':
        return '⭐'; // Star emoji
      case 'pail':
        return '🪣'; // Bucket emoji
      case 'lollipop':
        return '🍭'; // Lollipop emoji
      case 'jellybean':
        return '🍬'; // Candy emoji
      case 'cupcake':
        return '🧁'; // Cupcake emoji
      case 'star':
        return '⭐'; // Star emoji
      case 'planet':
        return '🪐'; // Planet emoji
      case 'comet':
        return '☄️'; // Comet emoji
      default:
        return '🎁'; // Gift box for unknown items
    }
  }
  
  // Special bubbles - unique shapes for special effects
  if (bubble.type === 'special') {
    switch (bubble.special) {
      case 'rainbow':
        return '🌈'; // Rainbow
      case 'disco':
        return '💫'; // Sparkles
      case 'giggle':
        return '😄'; // Laughing face
      case 'freeze':
        return '❄️'; // Snowflake
      default:
        return '✨'; // Sparkles for unknown specials
    }
  }
  
  // Avoider bubbles - warning shapes
  if (bubble.type === 'avoider') {
    switch (bubble.avoider) {
      case 'mud':
        return '⚠️'; // Warning sign
      case 'thorns':
        return '🌵'; // Cactus
      case 'slime':
        return '🟢'; // Green circle (slime)
      case 'ice':
        return '🧊'; // Ice cube
      default:
        return '⚠️'; // Warning for unknown avoiders
    }
  }
  
  // Fallback
  return '●';
}

function getBubbleImageSource(color?: string, size: 'small'|'medium'|'large' = 'medium') {
  // Use static requires per color/size so Metro bundles images
  if (size === 'small') {
    switch (color) {
      case 'blue':
        return require('@/assets/bubbles/blue_bubble_small.png');
      case 'green':
        return require('@/assets/bubbles/green_bubble_small.png');
      case 'pink':
        return require('@/assets/bubbles/pink_bubble_small.png');
      case 'yellow':
        return require('@/assets/bubbles/yellow_bubble_small.png');
      default:
        return require('@/assets/bubbles/blue_bubble_small.png');
    }
  }
  if (size === 'large') {
    switch (color) {
      case 'blue':
        return require('@/assets/bubbles/blue_bubble_large.png');
      case 'green':
        return require('@/assets/bubbles/green_bubble_large.png');
      case 'pink':
        return require('@/assets/bubbles/pink_bubble_large.png');
      case 'yellow':
        return require('@/assets/bubbles/yellow_bubble_large.png');
      default:
        return require('@/assets/bubbles/blue_bubble_large.png');
    }
  }
  // medium (default)
  switch (color) {
    case 'blue':
      return require('@/assets/bubbles/blue_bubble_medium.png');
    case 'green':
      return require('@/assets/bubbles/green_bubble_medium.png');
    case 'pink':
      return require('@/assets/bubbles/pink_bubble_medium.png');
    case 'yellow':
      return require('@/assets/bubbles/yellow_bubble_medium.png');
    default:
      return require('@/assets/bubbles/blue_bubble_medium.png');
  }
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
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 8,
  },
  assistIconContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  assistIconText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowRadius: 2,
    textShadowOffset: { width: 0, height: 1 },
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
  debugPanel: {
    position: 'absolute',
    bottom: 100,
    left: 16,
    right: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  debugButton: {
    flex: 1,
    marginHorizontal: 4,
  },
  debugButtonLeft: {
    flex: 1,
    marginHorizontal: 4,
  },
  devToggleButton: {
    flex: 1,
    marginHorizontal: 4,
  },
  devTogglesCard: {
    position: 'absolute',
    bottom: 160,
    left: 16,
    right: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
  },
  devTogglesTitle: {
    marginBottom: 16,
    textAlign: 'center',
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  toggleDivider: {
    marginVertical: 8,
  },
  sliderContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 8,
  },
  sliderValue: {
    marginHorizontal: 16,
    fontSize: 16,
    fontWeight: 'bold',
  },
});


