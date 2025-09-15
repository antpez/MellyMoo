import { grantReward } from '@/src/services/rewards';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { Button, Card, Text } from 'react-native-paper';

export default function RewardReveal() {
  const params = useLocalSearchParams<{ key?: string; type?: string; title?: string }>();
  const [granted, setGranted] = useState(false);

  useEffect(() => {
    async function grant() {
      if (params.key && params.type) {
        await grantReward({ key: String(params.key), type: params.type as any, title: params.title ? String(params.title) : undefined });
        setGranted(true);
      }
    }
    grant();
  }, [params.key, params.type, params.title]);

  return (
    <View style={{ flex: 1, padding: 16, justifyContent: 'center', alignItems: 'center' }}>
      <Text variant="headlineSmall" style={{ marginBottom: 16 }}>Reward Reveal</Text>
      <Card style={{ width: '80%', marginBottom: 24 }}>
        <Card.Title title={(params.title as string) || (params.key as string) || 'Reward'} subtitle={params.type as string} />
        <Card.Content>
          <Text>{granted ? 'Added to your collection!' : 'Adding to your collection...'}</Text>
        </Card.Content>
      </Card>
      <Button onPress={() => router.replace('/home')}>Done</Button>
    </View>
  );
}


