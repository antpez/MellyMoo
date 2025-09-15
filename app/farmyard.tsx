import React from 'react';
import { View } from 'react-native';
import { Text } from 'react-native-paper';

export default function FarmyardScreen() {
  return (
    <View style={{ flex: 1, padding: 16, justifyContent: 'center', alignItems: 'center' }}>
      <Text variant="headlineMedium">Farmyard</Text>
      <Text style={{ marginTop: 16, textAlign: 'center' }}>Coming soon! Decorate your farmyard with items you collect.</Text>
    </View>
  );
}
