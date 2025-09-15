import React from 'react';
import { View } from 'react-native';
import { Text } from 'react-native-paper';

export default function WardrobeScreen() {
  return (
    <View style={{ flex: 1, padding: 16, justifyContent: 'center', alignItems: 'center' }}>
      <Text variant="headlineMedium">Wardrobe</Text>
      <Text style={{ marginTop: 16, textAlign: 'center' }}>Coming soon! Dress up Melly Moo with costumes you collect.</Text>
    </View>
  );
}
