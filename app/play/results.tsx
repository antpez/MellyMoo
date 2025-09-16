import { rollReward } from '@/src/services/rewards';
import { router, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { View } from 'react-native';
import { Button, Text } from 'react-native-paper';

export default function Results() {
  const params = useLocalSearchParams<{ theme?: string; level?: string }>();
  const theme = (params?.theme as string) || 'farm';
  const level = Number(params?.level ?? '1') || 1;
  async function handleContinue() {
    const reward = await rollReward({ theme, level });
    router.push({ pathname: '/play/reward-reveal', params: { key: reward.key, type: reward.type, title: reward.title ?? '' } });
  }

  return (
    <View style={{ flex: 1, padding: 16, justifyContent: 'center', alignItems: 'center' }}>
      <Text variant="headlineMedium" style={{ marginBottom: 8 }}>You did it!</Text>
      <Text style={{ marginBottom: 24 }}>Stars: 3  •  Stickers found: 1</Text>
      <Button mode="contained" onPress={handleContinue}>Continue</Button>
    </View>
  );
}


