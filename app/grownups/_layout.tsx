import { Stack } from 'expo-router';
import React from 'react';

export default function GrownupsLayout() {
  return (
    <Stack screenOptions={{ headerShown: true }}>
      <Stack.Screen name="index" options={{ title: 'Grown-ups Area' }} />
      <Stack.Screen name="parent-gate" options={{ title: 'Parent Gate' }} />
      <Stack.Screen name="shop" options={{ title: 'Shop' }} />
      <Stack.Screen name="privacy" options={{ title: 'Privacy' }} />
      <Stack.Screen name="support" options={{ title: 'Support' }} />
    </Stack>
  );
}
