import React from 'react';
import { View } from 'react-native';
import { Text } from 'react-native-paper';

export default function StickerBookScreen() {
  return (
    <View style={{ flex: 1, padding: 16, justifyContent: 'center', alignItems: 'center' }}>
      <Text variant="headlineMedium">Sticker Book</Text>
      <Text style={{ marginTop: 16, textAlign: 'center' }}>Coming soon! Collect stickers by playing levels.</Text>
    </View>
  );
}
