import { router } from 'expo-router';
import React, { useState } from 'react';
import { View } from 'react-native';
import { Button, SegmentedButtons, Text } from 'react-native-paper';

const themes = ['farm', 'beach', 'candy', 'space'];

export default function PlaySetup() {
  const [theme, setTheme] = useState<string>('farm');
  const [objective, setObjective] = useState<string>('surprise');
  const [level, setLevel] = useState<number>(1);

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text variant="titleMedium" style={{ marginBottom: 8 }}>World</Text>
      <SegmentedButtons
        value={theme}
        onValueChange={setTheme}
        buttons={themes.map((t) => ({ value: t, label: t }))}
        style={{ marginBottom: 16 }}
      />
      <Text variant="titleMedium" style={{ marginBottom: 8 }}>Objective</Text>
      <SegmentedButtons
        value={objective}
        onValueChange={setObjective}
        buttons={[{ value: 'auto', label: 'Auto' }, { value: 'surprise', label: 'Surprise!' }]}
        style={{ marginBottom: 24 }}
      />
      <Text variant="titleMedium" style={{ marginBottom: 8 }}>Level</Text>
      <SegmentedButtons
        value={String(level)}
        onValueChange={(v) => setLevel(Number(v))}
        buttons={[1,5,10,15,20].map((n) => ({ value: String(n), label: String(n) }))}
        style={{ marginBottom: 24 }}
      />
      <Button mode="contained" onPress={() => router.push({ pathname: '/play/gameplay', params: { theme, objective, level: String(level) }})}>Start</Button>
    </View>
  );
}


