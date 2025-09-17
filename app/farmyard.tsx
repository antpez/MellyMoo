import { useInventoryStore } from '@/src/services/inventory';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { Dimensions, Image, ScrollView, StyleSheet, TouchableOpacity, useColorScheme, View } from 'react-native';
import { Button, Card, FAB, Modal, Portal, Text, useTheme } from 'react-native-paper';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Decoration definitions available to place (no position/id yet)
type Decoration = {
  type: string;
  size: number;
  emoji: string;
  name: string;
};

type PlacedDecoration = {
  id: string;
  type: string;
  x: number;
  y: number;
  size: number;
  emoji: string;
  name: string;
};

const FARM_BOUNDARIES = {
  left: 20,
  right: SCREEN_WIDTH - 20,
  top: 100,
  bottom: SCREEN_HEIGHT - 200,
};

const AVAILABLE_DECORATIONS: Decoration[] = [
  { type: 'tree', emoji: '🌳', name: 'Tree', size: 60 },
  { type: 'flower', emoji: '🌸', name: 'Flower', size: 40 },
  { type: 'fence', emoji: '🚧', name: 'Fence', size: 50 },
  { type: 'barn', emoji: '🏚️', name: 'Barn', size: 80 },
  { type: 'pond', emoji: '🪣', name: 'Pond', size: 70 },
  { type: 'rock', emoji: '🪨', name: 'Rock', size: 45 },
  { type: 'bush', emoji: '🌿', name: 'Bush', size: 55 },
  { type: 'windmill', emoji: '🌪️', name: 'Windmill', size: 65 },
];

export default function Farmyard() {
  const colorScheme = useColorScheme();
  const theme = useTheme();
  const isDark = colorScheme === 'dark';

  const [showInventory, setShowInventory] = useState(false);
  const [placedDecorations, setPlacedDecorations] = useState<PlacedDecoration[]>([]);
  const { getOwnedItems, addItem } = useInventoryStore();

  const STORAGE_KEY = 'farmyard-decorations';

  const ownedDecorations = getOwnedItems('decor');
  const availableDecorations = AVAILABLE_DECORATIONS.filter(decoration => 
    ownedDecorations.some(owned => owned.key === decoration.type)
  );

  // Load saved decorations on mount
  useEffect(() => {
    let isActive = true;
    (async () => {
      try {
        const saved = await AsyncStorage.getItem(STORAGE_KEY);
        if (!isActive) return;
        if (saved) {
          const parsed: PlacedDecoration[] = JSON.parse(saved);
          setPlacedDecorations(Array.isArray(parsed) ? parsed : []);
        }
      } catch (e) {
        // noop
      }
    })();
    return () => {
      isActive = false;
    };
  }, []);

  // Auto-save whenever decorations change
  useEffect(() => {
    (async () => {
      try {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(placedDecorations));
      } catch (e) {
        // noop
      }
    })();
  }, [placedDecorations]);

  const saveDecorations = async () => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(placedDecorations));
    } catch (e) {
      // noop
    }
  };

  const clearFarmyard = async () => {
    setPlacedDecorations([]);
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify([]));
    } catch (e) {
      // noop
    }
  };

  const addSampleDecoration = async () => {
    const sampleDecorations = [
      { key: 'tree', title: 'Tree', theme: 'farm' },
      { key: 'flower', title: 'Flower', theme: 'farm' },
      { key: 'fence', title: 'Fence', theme: 'farm' },
      { key: 'barn', title: 'Barn', theme: 'farm' },
    ];
    
    const randomDecoration = sampleDecorations[Math.floor(Math.random() * sampleDecorations.length)];
    await addItem({
      key: randomDecoration.key,
      kind: 'decor',
      title: randomDecoration.title,
      theme: randomDecoration.theme,
    });
  };

  const isWithinBounds = (x: number, y: number, size: number) => {
    return x >= FARM_BOUNDARIES.left && 
           x <= FARM_BOUNDARIES.right - size &&
           y >= FARM_BOUNDARIES.top && 
           y <= FARM_BOUNDARIES.bottom - size;
  };

  const handlePlaceDecoration = (decoration: Decoration) => {
    // Place decoration in a random position within bounds
    const maxX = FARM_BOUNDARIES.right - decoration.size;
    const maxY = FARM_BOUNDARIES.bottom - decoration.size;
    
    const x = Math.random() * (maxX - FARM_BOUNDARIES.left) + FARM_BOUNDARIES.left;
    const y = Math.random() * (maxY - FARM_BOUNDARIES.top) + FARM_BOUNDARIES.top;
    
    const newDecoration: PlacedDecoration = {
      ...decoration,
      id: `${decoration.type}-${Date.now()}-${Math.random()}`, // Ensure unique ID
      x: Math.round(x),
      y: Math.round(y),
    };
    
    setPlacedDecorations(prev => [...prev, newDecoration]);
  };

  const dynamicStyles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDark ? '#000000' : '#F0F8F0',
    },
    farmBoundary: {
      flex: 1,
      backgroundColor: isDark ? '#0A1A0A' : '#E8F5E8',
      borderRadius: 16,
      borderWidth: 3,
      borderColor: '#4CAF50',
      borderStyle: 'dashed',
      position: 'relative',
      minHeight: 400,
    },
    actionButtons: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      padding: 16,
      backgroundColor: isDark ? '#1A1A1A' : 'white',
      borderTopWidth: 1,
      borderTopColor: isDark ? '#333333' : '#E0E0E0',
    },
    modalContent: {
      backgroundColor: isDark ? '#1A1A1A' : 'white',
      margin: 20,
      borderRadius: 16,
      maxHeight: '80%',
    },
    emptyCard: {
      marginVertical: 20,
      backgroundColor: isDark ? '#2D1B0B' : '#FFF3E0',
      borderWidth: 1,
      borderColor: '#FFB74D',
    },
  });

  return (
    <View style={dynamicStyles.container}>
      <View style={styles.logoContainer}>
        <Image
          source={require('@/assets/images/mellymoo_logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      <View style={styles.content}>
        {/* Farm Area */}
        <View style={styles.farmArea}>
          <View style={dynamicStyles.farmBoundary}>
            <Text variant="bodyMedium" style={styles.boundaryText}>
              Decorate your farmyard! Drag decorations from the inventory.
            </Text>
            
            {/* Placed Decorations */}
            {placedDecorations.map((decoration) => (
              <View
                key={decoration.id}
                style={[
                  styles.placedDecoration,
                  {
                    left: decoration.x,
                    top: decoration.y,
                    width: decoration.size,
                    height: decoration.size,
                  },
                ]}
              >
                <Text style={styles.decorationEmoji}>{decoration.emoji}</Text>
              </View>
            ))}

          </View>
        </View>

        {/* Action Buttons */}
        <View style={dynamicStyles.actionButtons}>
          <Button 
            mode="outlined" 
            onPress={clearFarmyard}
            style={styles.actionButton}
          >
            Clear All
          </Button>
          <Button 
            mode="contained" 
            onPress={saveDecorations}
            style={styles.actionButton}
          >
            Save Farmyard
          </Button>
          <Button 
            mode="outlined" 
            onPress={addSampleDecoration}
            style={styles.actionButton}
          >
            Add Sample
          </Button>
        </View>
      </View>

      {/* Floating Action Button for Inventory */}
      <FAB
        icon="package-variant"
        style={styles.fab}
        onPress={() => setShowInventory(true)}
      />

      {/* Inventory Modal */}
      <Portal>
        <Modal
          visible={showInventory}
          onDismiss={() => setShowInventory(false)}
          contentContainerStyle={dynamicStyles.modalContent}
        >
          <View style={styles.modalHeader}>
            <Text variant="headlineSmall">Decoration Inventory</Text>
            <Button onPress={() => setShowInventory(false)}>Close</Button>
          </View>
          
          <ScrollView style={styles.inventoryGrid}>
            {availableDecorations.length === 0 ? (
              <Card style={dynamicStyles.emptyCard}>
                <Card.Content>
                  <Text variant="bodyLarge" style={styles.emptyText}>
                    No decorations available yet!
                  </Text>
                  <Text variant="bodyMedium" style={styles.emptySubtext}>
                    Play the game to earn decorations as rewards.
                  </Text>
                </Card.Content>
              </Card>
            ) : (
              availableDecorations.map((decoration) => (
                <DraggableDecoration
                  key={decoration.type}
                  decoration={decoration}
                  onDragStart={() => handlePlaceDecoration(decoration)}
                />
              ))
            )}
          </ScrollView>
        </Modal>
      </Portal>
    </View>
  );
}

// Draggable Decoration Component
function DraggableDecoration({ 
  decoration, 
  onDragStart 
}: { 
  decoration: Decoration; 
  onDragStart: () => void;
}) {
  return (
    <TouchableOpacity 
      style={styles.inventoryItem}
      onPress={() => onDragStart()}
    >
      <Card style={styles.decorationCard}>
        <Card.Content style={styles.decorationContent}>
          <Text style={styles.decorationEmoji}>{decoration.emoji}</Text>
          <Text variant="bodySmall" style={styles.decorationName}>
            {decoration.name}
          </Text>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  logoContainer: {
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  logo: {
    width: 200,
    height: 120,
    maxWidth: '80%',
  },
  content: {
    flex: 1,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
  farmArea: {
    flex: 1,
    padding: 16,
  },
  boundaryText: {
    textAlign: 'center',
    padding: 16,
    color: '#4CAF50',
    fontWeight: '600',
  },
  placedDecoration: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#4CAF50',
  },
  decorationEmoji: {
    fontSize: 24,
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 4,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  inventoryGrid: {
    padding: 16,
  },
  inventoryItem: {
    marginBottom: 12,
  },
  decorationCard: {
    elevation: 2,
  },
  decorationContent: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  decorationName: {
    marginTop: 4,
    textAlign: 'center',
  },
  emptyText: {
    textAlign: 'center',
    fontWeight: '600',
    marginBottom: 8,
  },
  emptySubtext: {
    textAlign: 'center',
    opacity: 0.7,
  },
});