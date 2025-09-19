import { grantReward } from '@/src/services/rewards';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, useColorScheme } from 'react-native';
import { Button, Card, Text, useTheme } from 'react-native-paper';

export default function RewardReveal() {
  const colorScheme = useColorScheme();
  const theme = useTheme();
  const isDark = colorScheme === 'dark';

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

  const dynamicStyles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDark ? '#000000' : '#FFFFFF',
    },
    card: {
      width: '80%',
      marginBottom: 24,
      backgroundColor: isDark ? '#1A1A1A' : '#FFFFFF',
    },
  });

  return (
    <ScrollView 
      style={dynamicStyles.container}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
      bounces={true}
    >
      <Text variant="headlineSmall" style={{ marginBottom: 16, color: isDark ? '#FFFFFF' : '#000000' }}>Reward Reveal</Text>
      <Card style={dynamicStyles.card}>
        <Card.Title title={(params.title as string) || (params.key as string) || 'Reward'} subtitle={params.type as string} />
        <Card.Content>
          <Text style={{ color: isDark ? '#CCCCCC' : '#000000' }}>{granted ? 'Added to your collection!' : 'Adding to your collection...'}</Text>
        </Card.Content>
      </Card>
      <Button onPress={() => router.replace('/home')}>Done</Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
});
