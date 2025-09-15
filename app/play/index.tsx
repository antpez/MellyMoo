import { router } from 'expo-router';
import React from 'react';
import { View } from 'react-native';
import { Button, Text } from 'react-native-paper';

export default function PlayIndex() {
  return (
    <View style={{ flex: 1, padding: 16, justifyContent: 'center', alignItems: 'center' }}>
      <Text variant="headlineMedium" style={{ marginBottom: 16 }}>Play</Text>
      <Button mode="contained" onPress={() => router.push('/play/setup')} style={{ marginBottom: 12 }}>
        Start New Game
      </Button>
      <Button onPress={() => router.back()}>Back to Home</Button>
    </View>
  );
}
