import { useInventoryStore } from '@/src/services/inventory';
import { useWardrobeStore } from '@/src/services/wardrobe';
import React, { useState } from 'react';
import { Image, ScrollView, StyleSheet, useColorScheme, View } from 'react-native';
import { Button, Card, Text, useTheme } from 'react-native-paper';

export default function Wardrobe() {
  const colorScheme = useColorScheme();
  const theme = useTheme();
  const isDark = colorScheme === 'dark';

  const { getOwnedItems } = useInventoryStore();
  const costumes = getOwnedItems('costume');

  const { equippedCostumeKey, equipCostume, clearCostume } = useWardrobeStore();
  
  // State for cow pose selection
  const [currentPose, setCurrentPose] = useState<'normal' | 'shocked' | 'sitting' | 'waving'>('normal');

  // Function to get cow image based on pose
  const getCowImage = (pose: string) => {
    switch (pose) {
      case 'shocked':
        return require('@/assets/images/cow_shocked.png');
      case 'sitting':
        return require('@/assets/images/cow_sitting.png');
      case 'waving':
        return require('@/assets/images/cow_waving.png');
      case 'normal':
      default:
        return require('@/assets/images/cow_1.png');
    }
  };

  const dynamicStyles = StyleSheet.create({
    container: { 
      flex: 1,
      backgroundColor: isDark ? '#000000' : '#FFFFFF',
    },
    emptyCard: { 
      backgroundColor: isDark ? '#2D1B0B' : '#FFF3E0',
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

      <ScrollView contentContainerStyle={styles.content}>
        <Card style={styles.previewCard}>
          <Card.Content style={styles.previewContent}>
            <Text variant="titleMedium">Current Outfit</Text>
            <View style={styles.avatarWrapper}>
              <View style={styles.avatarCircle}>
                <Image 
                  source={getCowImage(currentPose)} 
                  style={styles.cowImage}
                  resizeMode="contain"
                />
              </View>
              {equippedCostumeKey ? (
                <View style={styles.badge}>
                  <Text variant="labelSmall" style={styles.badgeText}>{equippedCostumeKey}</Text>
                </View>
              ) : null}
            </View>
            <Text variant="bodyLarge" style={styles.previewText}>
              {equippedCostumeKey ? `Equipped: ${equippedCostumeKey}` : 'No costume equipped'}
            </Text>
            
            {/* Pose Selection Buttons */}
            <View style={styles.poseButtons}>
              <Text variant="bodyMedium" style={styles.poseLabel}>Choose Pose:</Text>
              <View style={styles.poseButtonRow}>
                <Button 
                  mode={currentPose === 'normal' ? 'contained' : 'outlined'}
                  onPress={() => setCurrentPose('normal')}
                  style={styles.poseButton}
                  compact
                >
                  Normal
                </Button>
                <Button 
                  mode={currentPose === 'shocked' ? 'contained' : 'outlined'}
                  onPress={() => setCurrentPose('shocked')}
                  style={styles.poseButton}
                  compact
                >
                  Shocked
                </Button>
                <Button 
                  mode={currentPose === 'sitting' ? 'contained' : 'outlined'}
                  onPress={() => setCurrentPose('sitting')}
                  style={styles.poseButton}
                  compact
                >
                  Sitting
                </Button>
                <Button 
                  mode={currentPose === 'waving' ? 'contained' : 'outlined'}
                  onPress={() => setCurrentPose('waving')}
                  style={styles.poseButton}
                  compact
                >
                  Waving
                </Button>
              </View>
            </View>
          </Card.Content>
        </Card>

        <Text variant="titleMedium" style={styles.sectionTitle}>Owned Costumes</Text>
        {costumes.length === 0 ? (
          <Card style={dynamicStyles.emptyCard}>
            <Card.Content>
              <Text>You don't have any costumes yet. Earn them as rewards!</Text>
            </Card.Content>
          </Card>
        ) : (
          costumes.map((c) => (
            <Card key={c.id ?? c.key} style={styles.costumeCard}>
              <Card.Title title={c.title ?? c.key} subtitle={c.key} />
              <Card.Actions>
                {equippedCostumeKey === c.key ? (
                  <Button mode="contained" onPress={() => clearCostume()}>Unequip</Button>
                ) : (
                  <Button mode="contained" onPress={() => equipCostume(c.key)}>Equip</Button>
                )}
              </Card.Actions>
            </Card>
          ))
        )}
      </ScrollView>
    </View>
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
  content: { padding: 16 },
  previewCard: { marginBottom: 16 },
  previewContent: { alignItems: 'center' },
  avatarWrapper: { marginTop: 12, marginBottom: 4 },
  avatarCircle: {
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#E0E0E0',
  },
  cowImage: { 
    width: 160, 
    height: 160,
  },
  badge: {
    position: 'absolute',
    right: -6,
    bottom: -6,
    backgroundColor: '#1976D2',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: { color: 'white' },
  previewText: { marginTop: 8 },
  poseButtons: {
    marginTop: 16,
    alignItems: 'center',
  },
  poseLabel: {
    marginBottom: 8,
    fontWeight: '500',
  },
  poseButtonRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
  },
  poseButton: {
    marginHorizontal: 2,
    marginVertical: 2,
  },
  sectionTitle: { marginVertical: 12 },
  costumeCard: { marginBottom: 12 },
});

