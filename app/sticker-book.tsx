import { useInventoryStore } from '@/src/services/inventory';
import React, { useState } from 'react';
import { Dimensions, Image, ScrollView, StyleSheet, useColorScheme, View } from 'react-native';
import { Card, Chip, SegmentedButtons, Text, useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

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
  const colorScheme = useColorScheme();
  const theme = useTheme();
  const isDark = colorScheme === 'dark';

  const [selectedTheme, setSelectedTheme] = useState<StickerTheme>('farm');
  const { getOwnedItems, addItem } = useInventoryStore();

  const ownedStickers = getOwnedItems('sticker');
  const themeStickers = ownedStickers.filter(sticker => 
    sticker.theme === selectedTheme
  );

  // Function to get sticker image based on ID
  const getStickerImage = (stickerId: string) => {
    const imageMap: Record<string, any> = {
      // Farm stickers
      'duck': require('@/assets/stickers/duck_sticker.png'),
      'carrot': require('@/assets/stickers/carrot_sticker.png'),
      'apple': require('@/assets/stickers/apple_sticker.png'),
      'flower': require('@/assets/stickers/flower_sticker.png'),
      'barn': require('@/assets/stickers/barn_sticker.png'),
      'cow': require('@/assets/stickers/cow_waving_sticker.png'),
      
      // Beach stickers
      'shell': require('@/assets/stickers/shell_sticker.png'),
      'starfish': require('@/assets/stickers/starfish_sticker.png'),
      'bucket': require('@/assets/stickers/bucket_sticker.png'),
      'crab': require('@/assets/stickers/crab_sticker.png'),
      'lighthouse': require('@/assets/stickers/lighthouse_sticker.png'),
      'seagull': require('@/assets/stickers/seagull_sticker.png'),
      
      // Candy stickers
      'lollipop': require('@/assets/stickers/lollypop_sticker.png'),
      'jellybean': require('@/assets/stickers/jellybean_sticker.png'),
      'cupcake': require('@/assets/stickers/cupcake_sticker.png'),
      'candycane': require('@/assets/stickers/candycane_sticker.png'),
      'chocolate': require('@/assets/stickers/chocolate_sticker.png'),
      
      // Space stickers
      'star': require('@/assets/stickers/star_sticker.png'),
      'planet': require('@/assets/stickers/planet_sticker.png'),
      'comet': require('@/assets/stickers/comet_sticker.png'),
      'rocket': require('@/assets/stickers/rocket_sticker.png'),
      'alien': require('@/assets/stickers/alien_sticker.png'),
      'moon': require('@/assets/stickers/moon_sticker.png'),
    };
    
    return imageMap[stickerId] || null;
  };

  const getThemeInfo = (theme: StickerTheme) => {
    const themeData = {
      farm: {
        title: 'Farm Collection',
        description: 'Collect farm animals and vegetables!',
        color: '#8FBC8F',
        stickers: [
          { id: 'duck', name: 'Duck', collected: themeStickers.some(s => s.key === 'duck') },
          { id: 'carrot', name: 'Carrot', collected: themeStickers.some(s => s.key === 'carrot') },
          { id: 'apple', name: 'Apple', collected: themeStickers.some(s => s.key === 'apple') },
          { id: 'flower', name: 'Flower', collected: themeStickers.some(s => s.key === 'flower') },
          { id: 'barn', name: 'Barn', collected: themeStickers.some(s => s.key === 'barn') },
          { id: 'cow', name: 'Cow', collected: themeStickers.some(s => s.key === 'cow') },
        ]
      },
      beach: {
        title: 'Beach Collection',
        description: 'Gather seashells and ocean treasures!',
        color: '#87CEEB',
        stickers: [
          { id: 'shell', name: 'Shell', collected: themeStickers.some(s => s.key === 'shell') },
          { id: 'starfish', name: 'Starfish', collected: themeStickers.some(s => s.key === 'starfish') },
          { id: 'bucket', name: 'Bucket', collected: themeStickers.some(s => s.key === 'bucket') },
          { id: 'crab', name: 'Crab', collected: themeStickers.some(s => s.key === 'crab') },
          { id: 'lighthouse', name: 'Lighthouse', collected: themeStickers.some(s => s.key === 'lighthouse') },
          { id: 'seagull', name: 'Seagull', collected: themeStickers.some(s => s.key === 'seagull') },
        ]
      },
      candy: {
        title: 'Candy Collection',
        description: 'Sweet treats and sugary delights!',
        color: '#FFB6C1',
        stickers: [
          { id: 'lollipop', name: 'Lollipop', collected: themeStickers.some(s => s.key === 'lollipop') },
          { id: 'jellybean', name: 'Jellybean', collected: themeStickers.some(s => s.key === 'jellybean') },
          { id: 'cupcake', name: 'Cupcake', collected: themeStickers.some(s => s.key === 'cupcake') },
          { id: 'candycane', name: 'Candy Cane', collected: themeStickers.some(s => s.key === 'candycane') },
          { id: 'chocolate', name: 'Chocolate', collected: themeStickers.some(s => s.key === 'chocolate') },
        ]
      },
      space: {
        title: 'Space Collection',
        description: 'Explore the cosmos and beyond!',
        color: '#4B0082',
        stickers: [
          { id: 'star', name: 'Star', collected: themeStickers.some(s => s.key === 'star') },
          { id: 'planet', name: 'Planet', collected: themeStickers.some(s => s.key === 'planet') },
          { id: 'comet', name: 'Comet', collected: themeStickers.some(s => s.key === 'comet') },
          { id: 'rocket', name: 'Rocket', collected: themeStickers.some(s => s.key === 'rocket') },
          { id: 'alien', name: 'Alien', collected: themeStickers.some(s => s.key === 'alien') },
          { id: 'moon', name: 'Moon', collected: themeStickers.some(s => s.key === 'moon') },
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
    
    try {
      await addItem({
        key: randomSticker.key,
        kind: 'sticker',
        title: randomSticker.title,
        theme: randomSticker.theme,
      });
      
      // Switch to the theme of the added sticker
      setSelectedTheme(randomSticker.theme as StickerTheme);
      
      console.log(`Added sticker: ${randomSticker.title} (${randomSticker.theme})`);
    } catch (error) {
      console.error('Failed to add sticker:', error);
    }
  };

  const dynamicStyles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDark ? '#000000' : '#F8F9FA',
    },
    stickerCard: {
      width: (SCREEN_WIDTH - 48) / 2,
      marginBottom: 16,
      elevation: 2,
      borderWidth: 2,
      backgroundColor: isDark ? '#1A1A1A' : '#FFFFFF',
    },
    emptyCard: {
      marginVertical: 20,
      backgroundColor: isDark ? '#2D1B0B' : '#FFF3E0',
      borderWidth: 1,
      borderColor: '#FFB74D',
    },
    debugCard: {
      marginTop: 16,
      backgroundColor: isDark ? '#2D1B0B' : '#FFF3E0',
      borderWidth: 1,
      borderColor: '#FFB74D',
    },
  });

  return (
    <SafeAreaView style={dynamicStyles.container} edges={['top', 'left', 'right']}>
      <View style={styles.logoContainer}>
        <Image
          source={require('@/assets/images/stickers.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

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
                dynamicStyles.stickerCard,
                { 
                  backgroundColor: sticker.collected 
                    ? currentTheme.color + '40' 
                    : isDark ? '#2A2A2A' : '#F5F5F5',
                  borderColor: sticker.collected ? currentTheme.color : isDark ? '#444444' : '#E0E0E0',
                }
              ]}
            >
              <Card.Content style={styles.stickerContent}>
                <View style={styles.stickerIcon}>
                  {sticker.collected ? (
                    <Image 
                      source={getStickerImage(sticker.id)} 
                      style={styles.stickerImage}
                      resizeMode="contain"
                    />
                  ) : (
                    <View style={styles.placeholderContainer}>
                      <Text variant="displaySmall" style={styles.placeholderText}>
                        ❓
                      </Text>
                    </View>
                  )}
                </View>
                <Text 
                  variant="bodyMedium" 
                  style={[
                    styles.stickerName,
                    { color: sticker.collected ? currentTheme.color : isDark ? '#CCCCCC' : '#999' }
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
        <Card style={dynamicStyles.debugCard}>
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
    </SafeAreaView>
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
  stickerContent: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  stickerIcon: {
    marginBottom: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stickerImage: {
    width: 60,
    height: 60,
  },
  placeholderContainer: {
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.1)',
    borderRadius: 30,
  },
  placeholderText: {
    opacity: 0.5,
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
  debugText: {
    textAlign: 'center',
    marginBottom: 12,
    opacity: 0.8,
  },
  debugButton: {
    alignSelf: 'center',
  },
});