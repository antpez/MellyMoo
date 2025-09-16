import { ParentGateService } from '@/src/services/parent-gate';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, View } from 'react-native';
import { Button, Card, Text } from 'react-native-paper';

export default function GrownupsIndex() {
  const [isVerified, setIsVerified] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState('');

  useEffect(() => {
    checkVerificationStatus();
  }, []);

  async function checkVerificationStatus() {
    const verified = await ParentGateService.isParentVerified();
    setIsVerified(verified);
    
    if (verified) {
      const remaining = await ParentGateService.getTimeRemainingFormatted();
      setTimeRemaining(remaining);
    }
  }

  async function handleLogout() {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout? You will need to verify again to access parent features.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await ParentGateService.clearVerification();
            setIsVerified(false);
            setTimeRemaining('');
          }
        }
      ]
    );
  }

  if (isVerified) {
    return (
      <View style={{ flex: 1, padding: 16, justifyContent: 'center' }}>
        <Card style={{ padding: 20, marginBottom: 20 }}>
          <Text variant="headlineMedium" style={{ marginBottom: 16, textAlign: 'center' }}>
            Parent Access Verified
          </Text>
          <Text style={{ marginBottom: 16, textAlign: 'center' }}>
            You have access to parent features and the shop.
          </Text>
          <Text variant="bodySmall" style={{ textAlign: 'center', color: '#666', marginBottom: 20 }}>
            Verification expires: {timeRemaining}
          </Text>
        </Card>
        
        <Button 
          mode="contained" 
          onPress={() => router.push('/grownups/shop')} 
          style={{ marginBottom: 12 }}
        >
          Open Shop
        </Button>
        <Button 
          mode="outlined" 
          onPress={handleLogout} 
          style={{ marginBottom: 12 }}
        >
          Logout
        </Button>
        <Button onPress={() => router.push('/grownups/privacy')}>Privacy Policy</Button>
        <Button onPress={() => router.push('/grownups/support')}>Support</Button>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, padding: 16, justifyContent: 'center' }}>
      <Text variant="headlineMedium" style={{ marginBottom: 16 }}>Grown-ups Area</Text>
      <Text style={{ marginBottom: 24 }}>This area is for parents and guardians only.</Text>
      <Button mode="contained" onPress={() => router.push('/grownups/parent-gate')} style={{ marginBottom: 12 }}>
        Enter Parent Gate
      </Button>
      <Button onPress={() => router.push('/grownups/privacy')}>Privacy Policy</Button>
      <Button onPress={() => router.push('/grownups/support')}>Support</Button>
    </View>
  );
}
