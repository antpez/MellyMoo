import { router } from 'expo-router';
import React from 'react';
import { View } from 'react-native';
import { Button, Text } from 'react-native-paper';

export default function HomeScreen() {
  return (
    <View style={{ flex: 1, padding: 16, justifyContent: 'center' }}>
      <Text variant="headlineMedium" style={{ marginBottom: 16 }}>Home</Text>
      <Button mode="contained" onPress={() => router.push('/play/setup')} style={{ marginBottom: 12 }}>Play</Button>
      <Button onPress={() => router.push('/children')}>Manage Children</Button>
      <Button onPress={() => router.push('/sticker-book')}>Sticker Book</Button>
      <Button onPress={() => router.push('/farmyard')}>Farmyard</Button>
      <Button onPress={() => router.push('/wardrobe')}>Wardrobe</Button>
      <Button onPress={() => router.push('/settings')}>Settings</Button>
      <Button onPress={() => router.push('/grownups')}>Grown-ups</Button>
      <Button style={{ marginTop: 24 }} onPress={() => router.replace('/')}>Back to Title</Button>
    </View>
  );
}
