import { useInventoryStore } from '@/src/services/inventory';
import { useWardrobeStore } from '@/src/services/wardrobe';
import { router } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Appbar, Button, Card, Text } from 'react-native-paper';

export default function Wardrobe() {
  const { getOwnedItems } = useInventoryStore();
  const costumes = getOwnedItems('costume');

  const { equippedCostumeKey, equipCostume, clearCostume } = useWardrobeStore();

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content title="Wardrobe" />
        {equippedCostumeKey ? (
          <Appbar.Action icon="delete" onPress={() => clearCostume()} />
        ) : null}
      </Appbar.Header>

      <ScrollView contentContainerStyle={styles.content}>
        <Card style={styles.previewCard}>
          <Card.Content style={styles.previewContent}>
            <Text variant="titleMedium">Current Outfit</Text>
            <View style={styles.avatarWrapper}>
              <View style={styles.avatarCircle}>
                <Text style={styles.avatarEmoji}>🐮</Text>
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
          </Card.Content>
        </Card>

        <Text variant="titleMedium" style={styles.sectionTitle}>Owned Costumes</Text>
        {costumes.length === 0 ? (
          <Card style={styles.emptyCard}>
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
  container: { flex: 1 },
  content: { padding: 16 },
  previewCard: { marginBottom: 16 },
  previewContent: { alignItems: 'center' },
  avatarWrapper: { marginTop: 12, marginBottom: 4 },
  avatarCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#E0E0E0',
  },
  avatarEmoji: { fontSize: 72 },
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
  sectionTitle: { marginVertical: 12 },
  emptyCard: { backgroundColor: '#FFF3E0' },
  costumeCard: { marginBottom: 12 },
});

