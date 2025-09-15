import { KeyboardDismissView } from '@/src/components/ui/KeyboardDismissView';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Button, Text, TextInput } from 'react-native-paper';

export default function ParentGate() {
  const [answer, setAnswer] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Simple math challenge for adults
  const challenge = { question: 'What is 7 + 3?', answer: '10' };

  function handleSubmit() {
    if (answer.trim() === challenge.answer) {
      router.push('/grownups/shop');
    } else {
      setError('Incorrect answer. Please try again.');
    }
  }

  return (
    <KeyboardDismissView style={{ flex: 1, padding: 16, justifyContent: 'center' }}>
      <Text variant="headlineMedium" style={{ marginBottom: 16 }}>Parent Gate</Text>
      <Text style={{ marginBottom: 24 }}>Please answer this question to continue:</Text>
      <Text variant="titleLarge" style={{ marginBottom: 16 }}>{challenge.question}</Text>
      <TextInput
        label="Answer"
        value={answer}
        onChangeText={setAnswer}
        keyboardType="numeric"
        style={{ marginBottom: 16 }}
      />
      {error ? <Text style={{ color: 'red', marginBottom: 16 }}>{error}</Text> : null}
      <Button mode="contained" onPress={handleSubmit}>Submit</Button>
    </KeyboardDismissView>
  );
}
