import { useInventoryStore } from '@/src/services/inventory';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Dimensions, ScrollView, StyleSheet, View } from 'react-native';
import { Appbar, Card, Chip, SegmentedButtons, Text } from 'react-native-paper';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

type StickerTheme = 'farm' | 'beach' | 'candy' | 'space';

type ThemeButton = { value: StickerTheme; label: string };
const THEMES: ThemeButton[] = [
  { value: 'farm', label: '🌾 Farm' },
  { value: 'beach', label: '🏖️ Beach' },
  { value: 'candy', label: '🍭 Candy' },
  { value: 'space', label: '🚀 Space' },
];

export default function StickerBook() {
  const [selectedTheme, setSelectedTheme] = useState<StickerTheme>('farm');
  const { getOwnedItems, addItem } = useInventoryStore();

  const ownedStickers = getOwnedItems('sticker');
  const themeStickers = ownedStickers.filter(sticker => 
    sticker.theme === selectedTheme
  );

  const getThemeInfo = (theme: StickerTheme) => {
    const themeData = {
      farm: {
        title: 'Farm Collection',
        description: 'Collect farm animals and vegetables!',
        color: '#8FBC8F',
        stickers: [
          { id: 'duck', name: 'Duck', collected: themeStickers.some(s => s.id === 'duck') },
          { id: 'carrot', name: 'Carrot', collected: themeStickers.some(s => s.id === 'carrot') },
          { id: 'apple', name: 'Apple', collected: themeStickers.some(s => s.id === 'apple') },
          { id: 'flower', name: 'Flower', collected: themeStickers.some(s => s.id === 'flower') },
          { id: 'barn', name: 'Barn', collected: themeStickers.some(s => s.id === 'barn') },
          { id: 'cow', name: 'Cow', collected: themeStickers.some(s => s.id === 'cow') },
        ]
      },
      beach: {
        title: 'Beach Collection',
        description: 'Gather seashells and ocean treasures!',
        color: '#87CEEB',
        stickers: [
          { id: 'shell', name: 'Shell', collected: themeStickers.some(s => s.id === 'shell') },
          { id: 'starfish', name: 'Starfish', collected: themeStickers.some(s => s.id === 'starfish') },
          { id: 'pail', name: 'Pail', collected: themeStickers.some(s => s.id === 'pail') },
          { id: 'crab', name: 'Crab', collected: themeStickers.some(s => s.id === 'crab') },
          { id: 'lighthouse', name: 'Lighthouse', collected: themeStickers.some(s => s.id === 'lighthouse') },
          { id: 'seagull', name: 'Seagull', collected: themeStickers.some(s => s.id === 'seagull') },
        ]
      },
      candy: {
        title: 'Candy Collection',
        description: 'Sweet treats and sugary delights!',
        color: '#FFB6C1',
        stickers: [
          { id: 'lollipop', name: 'Lollipop', collected: themeStickers.some(s => s.id === 'lollipop') },
          { id: 'jellybean', name: 'Jellybean', collected: themeStickers.some(s => s.id === 'jellybean') },
          { id: 'cupcake', name: 'Cupcake', collected: themeStickers.some(s => s.id === 'cupcake') },
          { id: 'gumdrop', name: 'Gumdrop', collected: themeStickers.some(s => s.id === 'gumdrop') },
          { id: 'candy_cane', name: 'Candy Cane', collected: themeStickers.some(s => s.id === 'candy_cane') },
          { id: 'chocolate', name: 'Chocolate', collected: themeStickers.some(s => s.id === 'chocolate') },
        ]
      },
      space: {
        title: 'Space Collection',
        description: 'Explore the cosmos and beyond!',
        color: '#4B0082',
        stickers: [
          { id: 'star', name: 'Star', collected: themeStickers.some(s => s.id === 'star') },
          { id: 'planet', name: 'Planet', collected: themeStickers.some(s => s.id === 'planet') },
          { id: 'comet', name: 'Comet', collected: themeStickers.some(s => s.id === 'comet') },
          { id: 'rocket', name: 'Rocket', collected: themeStickers.some(s => s.id === 'rocket') },
          { id: 'alien', name: 'Alien', collected: themeStickers.some(s => s.id === 'alien') },
          { id: 'moon', name: 'Moon', collected: themeStickers.some(s => s.id === 'moon') },
        ]
      }
    };
    return themeData[theme];
  };

  const currentTheme = getThemeInfo(selectedTheme);
  const collectedCount = currentTheme.stickers.filter(s => s.collected).length;
  const totalCount = currentTheme.stickers.length;

  const addSampleSticker = async () => {
    const sampleStickers = [
      { key: 'duck', title: 'Duck', theme: 'farm' },
      { key: 'carrot', title: 'Carrot', theme: 'farm' },
      { key: 'shell', title: 'Shell', theme: 'beach' },
      { key: 'lollipop', title: 'Lollipop', theme: 'candy' },
      { key: 'star', title: 'Star', theme: 'space' },
    ];
    
    const randomSticker = sampleStickers[Math.floor(Math.random() * sampleStickers.length)];
    await addItem({
      key: randomSticker.key,
      kind: 'sticker',
      title: randomSticker.title,
      theme: randomSticker.theme,
    });
  };

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content title="Sticker Book" />
      </Appbar.Header>

      <ScrollView style={styles.content}>
        {/* Theme Selector */}
        <View style={styles.themeSection}>
          <Text variant="headlineSmall" style={styles.sectionTitle}>
            Choose Your Collection
          </Text>
          <SegmentedButtons
            value={selectedTheme}
            onValueChange={(value) => setSelectedTheme(value as StickerTheme)}
            buttons={THEMES}
            style={styles.themeButtons}
          />
        </View>

        {/* Collection Info */}
        <Card style={[styles.infoCard, { backgroundColor: currentTheme.color + '20' }]}>
          <Card.Content>
            <Text variant="headlineMedium" style={styles.collectionTitle}>
              {currentTheme.title}
            </Text>
            <Text variant="bodyLarge" style={styles.collectionDescription}>
              {currentTheme.description}
            </Text>
            <View style={styles.progressContainer}>
              <Text variant="bodyMedium">
                {collectedCount} of {totalCount} stickers collected
              </Text>
              <Chip 
                mode="outlined" 
                style={[styles.progressChip, { borderColor: currentTheme.color }]}
              >
                {Math.round((collectedCount / totalCount) * 100)}%
              </Chip>
            </View>
          </Card.Content>
        </Card>

        {/* Sticker Grid */}
        <View style={styles.stickerGrid}>
          {currentTheme.stickers.map((sticker) => (
            <Card 
              key={sticker.id} 
              style={[
                styles.stickerCard,
                { 
                  backgroundColor: sticker.collected 
                    ? currentTheme.color + '40' 
                    : '#F5F5F5',
                  borderColor: sticker.collected ? currentTheme.color : '#E0E0E0',
                }
              ]}
            >
              <Card.Content style={styles.stickerContent}>
                <View style={styles.stickerIcon}>
                  <Text variant="displaySmall">
                    {sticker.collected ? '✨' : '❓'}
                  </Text>
                </View>
                <Text 
                  variant="bodyMedium" 
                  style={[
                    styles.stickerName,
                    { color: sticker.collected ? currentTheme.color : '#999' }
                  ]}
                >
                  {sticker.name}
                </Text>
                {sticker.collected && (
                  <Chip 
                    mode="flat" 
                    compact
                    style={[styles.collectedChip, { backgroundColor: currentTheme.color }]}
                  >
                    Collected!
                  </Chip>
                )}
              </Card.Content>
            </Card>
          ))}
        </View>

        {/* Collection Complete */}
        {collectedCount === totalCount && (
          <Card style={[styles.completeCard, { backgroundColor: currentTheme.color + '20' }]}>
            <Card.Content>
              <Text variant="headlineSmall" style={styles.completeTitle}>
                🎉 Collection Complete!
              </Text>
              <Text variant="bodyLarge" style={styles.completeDescription}>
                You've collected all {currentTheme.title} stickers! Amazing work!
              </Text>
            </Card.Content>
          </Card>
        )}

        {/* Debug: Add Sample Sticker */}
        <Card style={styles.debugCard}>
          <Card.Content>
            <Text variant="bodyMedium" style={styles.debugText}>
              Debug: Add a random sticker to test the collection
            </Text>
            <Chip 
              mode="outlined" 
              onPress={addSampleSticker}
              style={styles.debugButton}
            >
              Add Sample Sticker
            </Chip>
          </Card.Content>
        </Card>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  themeSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    textAlign: 'center',
    marginBottom: 16,
    fontWeight: 'bold',
  },
  themeButtons: {
    marginHorizontal: 8,
  },
  infoCard: {
    marginBottom: 24,
    elevation: 2,
  },
  collectionTitle: {
    textAlign: 'center',
    fontWeight: 'bold',
    marginBottom: 8,
  },
  collectionDescription: {
    textAlign: 'center',
    marginBottom: 16,
    opacity: 0.8,
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressChip: {
    marginLeft: 8,
  },
  stickerGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  stickerCard: {
    width: (SCREEN_WIDTH - 48) / 2,
    marginBottom: 16,
    elevation: 2,
    borderWidth: 2,
  },
  stickerContent: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  stickerIcon: {
    marginBottom: 8,
  },
  stickerName: {
    textAlign: 'center',
    fontWeight: '600',
    marginBottom: 8,
  },
  collectedChip: {
    marginTop: 4,
  },
  completeCard: {
    elevation: 3,
    borderWidth: 2,
    borderColor: '#4CAF50',
  },
  completeTitle: {
    textAlign: 'center',
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#4CAF50',
  },
  completeDescription: {
    textAlign: 'center',
    opacity: 0.8,
  },
  debugCard: {
    marginTop: 16,
    backgroundColor: '#FFF3E0',
    borderWidth: 1,
    borderColor: '#FFB74D',
  },
  debugText: {
    textAlign: 'center',
    marginBottom: 12,
    opacity: 0.8,
  },
  debugButton: {
    alignSelf: 'center',
  },
});