import { router } from 'expo-router';
import React from 'react';
import { View } from 'react-native';
import { Button, Text } from 'react-native-paper';

export default function GrownupsIndex() {
  return (
    <View style={{ flex: 1, padding: 16, justifyContent: 'center' }}>
      <Text variant="headlineMedium" style={{ marginBottom: 16 }}>Grown-ups Area</Text>
      <Text style={{ marginBottom: 24 }}>This area is for parents and guardians only.</Text>
      <Button mode="contained" onPress={() => router.push('/grownups/parent-gate')} style={{ marginBottom: 12 }}>
        Enter Parent Gate
      </Button>
      <Button onPress={() => router.push('/grownups/privacy')}>Privacy Policy</Button>
      <Button onPress={() => router.push('/grownups/support')}>Support</Button>
    </View>
  );
}
