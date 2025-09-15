import { Stack } from 'expo-router';
import React from 'react';

export default function PlayLayout() {
  return (
    <Stack screenOptions={{ headerShown: true }}>
      <Stack.Screen name="index" options={{ title: 'Play Setup' }} />
      <Stack.Screen name="setup" options={{ title: 'Play Setup' }} />
      <Stack.Screen name="gameplay" options={{ title: 'Gameplay' }} />
      <Stack.Screen name="results" options={{ title: 'Results' }} />
      <Stack.Screen name="reward-reveal" options={{ title: 'Reward' }} />
    </Stack>
  );
}


