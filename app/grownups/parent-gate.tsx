import { KeyboardDismissView } from '@/src/components/ui/KeyboardDismissView';
import { ParentGateService } from '@/src/services/parent-gate';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Image, ScrollView, StyleSheet, View } from 'react-native';
import { Button, Card, Text, TextInput } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

// Array of parent gate challenges
const challenges = [
  { question: 'What is 7 + 3?', answer: '10' },
  { question: 'What is 15 - 8?', answer: '7' },
  { question: 'What is 4 × 3?', answer: '12' },
  { question: 'What is 20 ÷ 4?', answer: '5' },
  { question: 'What is 9 + 6?', answer: '15' },
  { question: 'What is 12 - 5?', answer: '7' },
  { question: 'What is 6 × 2?', answer: '12' },
  { question: 'What is 18 ÷ 3?', answer: '6' },
  { question: 'What is 8 + 9?', answer: '17' },
  { question: 'What is 14 - 6?', answer: '8' },
  { question: 'What is 5 × 4?', answer: '20' },
  { question: 'What is 24 ÷ 6?', answer: '4' },
  { question: 'What is 11 + 7?', answer: '18' },
  { question: 'What is 16 - 9?', answer: '7' },
  { question: 'What is 3 × 7?', answer: '21' },
  { question: 'What is 30 ÷ 5?', answer: '6' },
  { question: 'What is 13 + 8?', answer: '21' },
  { question: 'What is 22 - 7?', answer: '15' },
  { question: 'What is 4 × 6?', answer: '24' },
  { question: 'What is 36 ÷ 9?', answer: '4' },
];

export default function ParentGateScreen() {
  const [currentChallenge, setCurrentChallenge] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    checkVerificationStatus();
  }, []);

  async function checkVerificationStatus() {
    const verified = await ParentGateService.isParentVerified();
    if (verified) {
      setIsVerified(true);
      setIsVerifying(true);
      // Redirect to grownups index after a short delay
      setTimeout(() => {
        router.replace('/grownups');
      }, 2000);
    }
  }

  function getRandomChallenge() {
    const randomIndex = Math.floor(Math.random() * challenges.length);
    setCurrentChallenge(randomIndex);
    setUserAnswer('');
  }

  function handleSubmit() {
    const correctAnswer = challenges[currentChallenge].answer;
    
    if (userAnswer.trim() === correctAnswer) {
      // Correct answer - verify parent
      ParentGateService.verifyParent();
      setIsVerified(true);
      setIsVerifying(true);
      // Redirect to grownups index after a short delay
      setTimeout(() => {
        router.replace('/grownups');
      }, 2000);
    } else {
      // Wrong answer - increment attempts and get new challenge
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      
      if (newAttempts >= 3) {
        // Too many attempts - get a new challenge
        setAttempts(0);
        getRandomChallenge();
      } else {
        // Try again with same challenge
        setUserAnswer('');
      }
    }
  }

  if (isVerifying) {
    return (
      <SafeAreaView style={{ flex: 1 }} edges={['top', 'left', 'right']}>
        <KeyboardDismissView style={{ flex: 1 }}>
          <View style={styles.logoContainer}>
            <Image
              source={require('@/assets/images/grownups.png')}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>
          <ScrollView 
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            bounces={true}
          >
            <Text variant="headlineMedium" style={{ marginBottom: 16 }}>Verifying...</Text>
            <Text>Please wait while we verify your access.</Text>
          </ScrollView>
        </KeyboardDismissView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }} edges={['top', 'left', 'right']}>
      <KeyboardDismissView style={{ flex: 1 }}>
        <View style={styles.logoContainer}>
          <Image
            source={require('@/assets/images/grownups.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>
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
              Please answer the following math question to verify you are a parent or guardian:
            </Text>
            
            <Text variant="titleLarge" style={{ marginBottom: 16, textAlign: 'center', fontWeight: 'bold' }}>
              {challenges[currentChallenge].question}
            </Text>
            
            <TextInput
              label="Your answer"
              value={userAnswer}
              onChangeText={setUserAnswer}
              keyboardType="numeric"
              style={{ marginBottom: 16 }}
              autoFocus
              returnKeyType="done"
              onSubmitEditing={handleSubmit}
            />
            
            <Button 
              mode="contained" 
              onPress={handleSubmit}
              disabled={!userAnswer.trim()}
              style={{ marginBottom: 12 }}
            >
              Submit Answer
            </Button>
            
            {attempts > 0 && (
              <Text style={{ textAlign: 'center', color: '#FF6F61' }}>
                Incorrect answer. Attempts: {attempts}/3
              </Text>
            )}
            
            <Button 
              mode="text" 
              onPress={getRandomChallenge}
              style={{ marginTop: 8 }}
            >
              New Question
            </Button>
          </Card>
        </ScrollView>
      </KeyboardDismissView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  logoContainer: {
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  logo: {
    width: 200,
    height: 120,
    maxWidth: '80%',
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 32,
  },
});