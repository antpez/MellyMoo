import { ParentGateService } from '@/src/services/parent-gate';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, useColorScheme } from 'react-native';
import { Button, Card, Text, useTheme } from 'react-native-paper';

export default function GrownupsIndex() {
  const colorScheme = useColorScheme();
  const theme = useTheme();
  const isDark = colorScheme === 'dark';

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

  const dynamicStyles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 16,
      justifyContent: 'center',
      backgroundColor: isDark ? '#000000' : '#FFFFFF',
    },
    card: {
      padding: 20,
      marginBottom: 20,
      backgroundColor: isDark ? '#1A1A1A' : '#FFFFFF',
    },
    title: {
      marginBottom: 16,
      textAlign: 'center',
      color: isDark ? '#FFFFFF' : '#000000',
    },
    text: {
      marginBottom: 16,
      textAlign: 'center',
      color: isDark ? '#CCCCCC' : '#000000',
    },
    smallText: {
      textAlign: 'center',
      color: isDark ? '#999999' : '#666',
      marginBottom: 20,
    },
  });

  if (isVerified) {
    return (
      <ScrollView 
        style={dynamicStyles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        bounces={true}
      >
        <Card style={dynamicStyles.card}>
          <Text variant="headlineMedium" style={dynamicStyles.title}>
            Parent Access Verified
          </Text>
          <Text style={dynamicStyles.text}>
            You have access to parent features and the shop.
          </Text>
          <Text variant="bodySmall" style={dynamicStyles.smallText}>
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
      </ScrollView>
    );
  }

  return (
    <ScrollView 
      style={dynamicStyles.container}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
      bounces={true}
    >
      <Text variant="headlineMedium" style={dynamicStyles.title}>Grown-ups Area</Text>
      <Text style={dynamicStyles.text}>This area is for parents and guardians only.</Text>
      <Button mode="contained" onPress={() => router.push('/grownups/parent-gate')} style={{ marginBottom: 12 }}>
        Enter Parent Gate
      </Button>
      <Button onPress={() => router.push('/grownups/privacy')}>Privacy Policy</Button>
      <Button onPress={() => router.push('/grownups/support')}>Support</Button>
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
