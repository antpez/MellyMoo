import { KeyboardDismissView } from '@/src/components/ui/KeyboardDismissView';
import { ParentGateService } from '@/src/services/parent-gate';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { Button, Card, Text, TextInput } from 'react-native-paper';

// Array of parent gate challenges
const challenges = [
  { question: 'What is 7 + 3?', answer: '10' },
  { question: 'What is 15 - 8?', answer: '7' },
  { question: 'What is 4 × 3?', answer: '12' },
  { question: 'What is 20 ÷ 4?', answer: '5' },
  { question: 'What is 9 + 6?', answer: '15' },
  { question: 'What is 12 - 5?', answer: '7' },
  { question: 'What is 3 × 4?', answer: '12' },
  { question: 'What is 18 ÷ 3?', answer: '6' },
];

export default function ParentGate() {
  const [answer, setAnswer] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [currentChallenge, setCurrentChallenge] = useState(challenges[0]);
  const [attempts, setAttempts] = useState(0);
  const [isVerified, setIsVerified] = useState(false);

  // Check if parent is already verified
  useEffect(() => {
    checkParentVerification();
  }, []);

  async function checkParentVerification() {
    const verified = await ParentGateService.isParentVerified();
    if (verified) {
      setIsVerified(true);
      router.replace('/grownups/shop');
    }
  }

  function getRandomChallenge() {
    const randomIndex = Math.floor(Math.random() * challenges.length);
    return challenges[randomIndex];
  }

  function handleSubmit() {
    const trimmedAnswer = answer.trim();
    
    if (trimmedAnswer === currentChallenge.answer) {
      // Correct answer - verify parent and store verification
      verifyParent();
    } else {
      // Incorrect answer
      setAttempts(prev => prev + 1);
      setError(`Incorrect answer. Please try again. (Attempt ${attempts + 1}/3)`);
      setAnswer('');
      
      if (attempts >= 2) {
        // Too many attempts - reset and show new challenge
        setAttempts(0);
        setCurrentChallenge(getRandomChallenge());
        setError('Too many incorrect attempts. Here\'s a new question.');
      }
    }
  }

  async function verifyParent() {
    const success = await ParentGateService.verifyParent();
    if (success) {
      router.replace('/grownups/shop');
    } else {
      setError('Verification failed. Please try again.');
    }
  }

  function handleNewChallenge() {
    setCurrentChallenge(getRandomChallenge());
    setAnswer('');
    setError(null);
    setAttempts(0);
  }

  if (isVerified) {
    return (
      <KeyboardDismissView style={{ flex: 1 }}>
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          bounces={true}
        >
          <Text variant="headlineMedium" style={{ marginBottom: 16 }}>Verifying...</Text>
          <Text>Please wait while we verify your access.</Text>
        </ScrollView>
      </KeyboardDismissView>
    );
  }

  return (
    <KeyboardDismissView style={{ flex: 1 }}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        bounces={true}
      >
        <Card style={{ padding: 20, marginBottom: 20 }}>
          <Text variant="headlineMedium" style={{ marginBottom: 16, textAlign: 'center' }}>
            Parent Verification
          </Text>
          <Text style={{ marginBottom: 24, textAlign: 'center' }}>
            This area is for parents and guardians only. Please answer the math question below to continue.
          </Text>
          
          <Text variant="titleLarge" style={{ marginBottom: 16, textAlign: 'center' }}>
            {currentChallenge.question}
          </Text>
          
          <TextInput
            label="Your Answer"
            value={answer}
            onChangeText={setAnswer}
            keyboardType="numeric"
            style={{ marginBottom: 16 }}
            accessibilityLabel="Enter your answer to the math question"
          />
          
          {error ? (
            <Text style={{ color: 'red', marginBottom: 16, textAlign: 'center' }}>
              {error}
            </Text>
          ) : null}
          
          <Button 
            mode="contained" 
            onPress={handleSubmit}
            style={{ marginBottom: 12 }}
            accessibilityLabel="Submit your answer"
          >
            Submit Answer
          </Button>
          
          <Button 
            mode="outlined" 
            onPress={handleNewChallenge}
            accessibilityLabel="Get a new math question"
          >
            New Question
          </Button>
        </Card>
        
        <Text variant="bodySmall" style={{ textAlign: 'center', color: '#666' }}>
          Verification expires after 24 hours for security.
        </Text>
      </ScrollView>
    </KeyboardDismissView>
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
