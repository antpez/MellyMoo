import { router } from 'expo-router';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { Button, Text } from 'react-native-paper';

export default function IndexScreen() {
  const { t } = useTranslation();
  
  return (
    <View style={{ flex: 1, padding: 16, justifyContent: 'center', alignItems: 'center' }}>
      <Text variant="headlineMedium" style={{ marginBottom: 16 }}>Melly Moo</Text>
      <Button mode="contained" onPress={() => router.replace('/home')}>{t('title.tapToPlay')}</Button>
    </View>
  );
}
